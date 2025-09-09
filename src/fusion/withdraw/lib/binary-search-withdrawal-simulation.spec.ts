import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type PublicClient, type Address, parseEther, formatEther } from 'viem';
import {
  binarySearchWithdrawalSimulation,
  type BisectArgs,
} from './binary-search-withdrawal-simulation';
import { mainnet } from 'viem/chains';

const MAX_SIMULATION_COUNT = 10;

vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    erc4626Abi: [{ name: 'withdraw', type: 'function' }],
  };
});

describe('binarySearchWithdrawalSimulation', () => {
  let mockPublicClient: PublicClient;
  let mockSimulateContract: ReturnType<typeof vi.fn>;

  const mockArgs: BisectArgs = {
    txArgs: {
      chainId: mainnet.id,
      fusionVaultAddress:
        '0x1234567890123456789012345678901234567890' as Address,
      accountAddress: '0x0987654321098765432109876543210987654321' as Address,
      publicClient: vi.fn() as unknown as PublicClient,
    },
    accountBalanceUnderlying: 1000n,
    maxSimulationCount: MAX_SIMULATION_COUNT,
  };

  beforeEach(() => {
    mockSimulateContract = vi.fn();
    mockPublicClient = {
      chain: { id: 1 },
      simulateContract: mockSimulateContract,
    } as unknown as PublicClient;
  });

  describe('when full withdrawal succeeds', () => {
    it('should return the full account balance', async () => {
      // Mock behavior: always succeed
      mockSimulateContract.mockResolvedValue({
        result: { success: true },
      });

      const result = await binarySearchWithdrawalSimulation({
        ...mockArgs,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      expect(result).toBe(1000n);
      expect(mockSimulateContract).toHaveBeenCalledTimes(2);
      expect(mockSimulateContract).toHaveBeenCalledWith({
        address: mockArgs.txArgs.fusionVaultAddress,
        abi: expect.any(Array),
        functionName: 'withdraw',
        account: mockArgs.txArgs.accountAddress,
        args: [
          1000n,
          mockArgs.txArgs.accountAddress,
          mockArgs.txArgs.accountAddress,
        ],
      });
    });
  });

  describe('when minimal 1n withdrawal fails', () => {
    it('should return 0', async () => {
      // Mock behavior: always fail
      // First call is 1n, if it fails, we return 0 and stop
      mockSimulateContract.mockRejectedValue(
        new Error('Insufficient liquidity'),
      );

      const result = await binarySearchWithdrawalSimulation({
        ...mockArgs,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      expect(result).toBe(0n);
      expect(mockSimulateContract).toHaveBeenCalledTimes(1);
      expect(mockSimulateContract).toHaveBeenCalledWith({
        address: mockArgs.txArgs.fusionVaultAddress,
        abi: expect.any(Array),
        functionName: 'withdraw',
        account: mockArgs.txArgs.accountAddress,
        args: [
          1n,
          mockArgs.txArgs.accountAddress,
          mockArgs.txArgs.accountAddress,
        ],
      });
    });
  });

  describe('when full withdrawal fails and binary search is needed', () => {
    it('should find maximum withdrawable amount using binary search', async () => {
      // Mock behavior: amounts > 875n fail, amounts <= 875n succeed
      mockSimulateContract.mockImplementation(({ args }) => {
        const amount = args[0];
        if (amount > 875n) {
          return Promise.reject(new Error('Insufficient liquidity'));
        }
        return Promise.resolve({ result: { success: true } });
      });

      const result = await binarySearchWithdrawalSimulation({
        ...mockArgs,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      // The algorithm should find the maximum amount < 875n that can be withdrawn
      // With binary search on range [0, 1000], it should converge to 874n
      expect(result).toBe(875n);
      expect(mockSimulateContract).toHaveBeenCalledTimes(10); // Max retry count reached
    });

    it('should handle case where only small amounts are withdrawable', async () => {
      // Mock behavior: amounts > 126n fail, amounts <= 126n succeed
      mockSimulateContract.mockImplementation(({ args }) => {
        const amount = args[0];
        if (amount > 126n) {
          return Promise.reject(new Error('Insufficient liquidity'));
        }
        return Promise.resolve({ result: { success: true } });
      });

      const result = await binarySearchWithdrawalSimulation({
        ...mockArgs,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      expect(result).toBe(125n);
      expect(mockSimulateContract).toHaveBeenCalledTimes(10);
    });

    it('should work with very small balance', async () => {
      // Mock behavior: amounts > 1n fail, amounts <= 1n succeed
      mockSimulateContract.mockImplementation(({ args }) => {
        const amount = args[0];
        if (amount > 1n) {
          return Promise.reject(new Error('Insufficient liquidity'));
        }
        return Promise.resolve({ result: { success: true } });
      });

      const result = await binarySearchWithdrawalSimulation({
        ...mockArgs,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      // No success simulation for binary search
      expect(result).toBe(0n);
      expect(mockSimulateContract).toHaveBeenCalledTimes(10); // Max retry count
    });
  });

  describe('edge cases', () => {
    it('should handle zero balance', async () => {
      // Mock all calls to fail
      mockSimulateContract.mockRejectedValue(
        new Error('Insufficient liquidity'),
      );

      const result = await binarySearchWithdrawalSimulation({
        ...mockArgs,
        accountBalanceUnderlying: 0n,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      expect(result).toBe(0n);
      expect(mockSimulateContract).toHaveBeenCalledTimes(0);
    });

    it('should handle very small balance', async () => {
      // Mock behavior: amounts > 1n fail, amounts <= 1n succeed
      mockSimulateContract.mockImplementation(({ args }) => {
        const amount = args[0];
        if (amount > 4n) {
          return Promise.reject(new Error('Insufficient liquidity'));
        }
        return Promise.resolve({ result: { success: true } });
      });

      const result = await binarySearchWithdrawalSimulation({
        ...mockArgs,
        accountBalanceUnderlying: 5n,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      expect(result).toBe(4n);
      expect(mockSimulateContract).toHaveBeenCalledTimes(4);
    });

    it('should handle large balance', async () => {
      const availableToInstantWithdraw = parseEther('65.456544');
      const accountBalance = parseEther('123.456932');
      // Mock behavior: amounts > availableToInstantWithdraw fail,
      // amounts <= availableToInstantWithdraw succeed
      mockSimulateContract.mockImplementation(({ args }) => {
        const amount = args[0];
        if (amount > availableToInstantWithdraw) {
          return Promise.reject(new Error('Insufficient liquidity'));
        }
        return Promise.resolve({ result: { success: true } });
      });

      const result = await binarySearchWithdrawalSimulation({
        ...mockArgs,
        accountBalanceUnderlying: accountBalance,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      expect(result).toBe(65104241484375000000n);
      expect(formatEther(result)).toBe('65.104241484375');
      expect(mockSimulateContract).toHaveBeenCalledTimes(10);
    });
  });

  describe('error handling', () => {
    it('should throw error when public client is on wrong chain', async () => {
      const wrongChainClient = {
        chain: { id: 2 }, // Wrong chain ID
        simulateContract: mockSimulateContract,
      } as unknown as PublicClient;

      await expect(
        binarySearchWithdrawalSimulation({
          ...mockArgs,
          txArgs: {
            ...mockArgs.txArgs,
            publicClient: wrongChainClient,
          },
        }),
      ).rejects.toThrow('publicClient.chain.id should be 1, but is 2');
    });
  });

  describe('binary search algorithm verification', () => {
    it('should test the correct sequence of amounts', async () => {
      const callArgs: bigint[] = [];
      // Mock behavior: amounts > 423n fail, amounts <= 423n succeed
      mockSimulateContract.mockImplementation(({ args }) => {
        const amount = args[0];
        callArgs.push(amount);
        if (amount > 423n) {
          return Promise.reject(new Error('Insufficient liquidity'));
        }
        return Promise.resolve({ result: { success: true } });
      });

      await binarySearchWithdrawalSimulation({
        ...mockArgs,
        txArgs: {
          ...mockArgs.txArgs,
          publicClient: mockPublicClient,
        },
      });

      // Should start with full amount (1000n)
      expect(callArgs[0]).toBe(1n);
      expect(callArgs[1]).toBe(1000n);
      expect(callArgs[2]).toBe(500n);
      expect(callArgs[3]).toBe(250n);
      expect(callArgs[4]).toBe(375n);
      expect(callArgs[5]).toBe(438n);
      expect(callArgs[6]).toBe(407n);
      expect(callArgs[7]).toBe(423n);
      expect(callArgs[8]).toBe(431n);
      expect(callArgs[9]).toBe(427n);
      expect(callArgs[10]).toBe(undefined);
    });
  });
});
