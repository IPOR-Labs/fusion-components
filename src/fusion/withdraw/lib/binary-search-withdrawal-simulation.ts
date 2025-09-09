import type { ChainId } from '@/app/config/wagmi';
import { type Address, erc4626Abi } from 'viem';
import type { usePublicClient } from 'wagmi';

interface TxArgs {
  chainId: ChainId;
  publicClient: ReturnType<typeof usePublicClient>;
  fusionVaultAddress: Address;
  accountAddress: Address;
}

export interface BisectArgs {
  accountBalanceUnderlying: bigint;
  maxSimulationCount: number;
  txArgs: TxArgs;
}

/**
 * Determines the maximum amount that can be withdrawn instantly from Fusion Vault
 * using a binary search algorithm to find the largest withdrawal amount that won't fail.
 *
 * This function is useful when a vault has liquidity constraints or withdrawal limits
 * that prevent withdrawing the full balance at once. It safely simulates withdrawals
 * to find the optimal amount without executing actual transactions.
 *
 * Algorithm:
 * 1. First attempts to withdraw the full account balance
 * 2. If successful, returns the full amount
 * 3. If it fails, uses binary search starting with half the balance
 * 4. For each attempt:
 *    - If withdrawal succeeds: search in the upper half (current amount to last failed amount)
 *    - If withdrawal fails: search in the lower half (last successful amount to current amount)
 * 5. Continues until reaching max simulation count
 *
 * @param accountBalanceUnderlying - The total balance available for withdrawal
 * @param chainId - The chain ID
 * @param publicClient - Viem public client for contract simulation
 * @param fusionVaultAddress - Address of the Fusion Vault contract
 * @param accountAddress - Address of the account attempting withdrawal
 * @param maxSimulationCount - Maximum number of simulation attempts
 * @returns Promise<bigint> - The maximum amount that can be withdrawn instantly
 */
export const binarySearchWithdrawalSimulation = async ({
  accountBalanceUnderlying,
  maxSimulationCount,
  txArgs,
}: BisectArgs) => {
  if (txArgs.publicClient.chain?.id !== txArgs.chainId) {
    throw new Error(
      `publicClient.chain.id should be ${txArgs.chainId}, but is ${txArgs.publicClient.chain?.id}`,
    );
  }

  let simulationCount = 0;

  if (accountBalanceUnderlying === 0n) {
    return 0n;
  }

  // First, try to withdraw minimal amount
  try {
    simulationCount++;
    await simulateWithdraw({
      txArgs,
      amount: 1n,
    });
    // If minimal withdrawal succeeds, then proceed
  } catch (error) {
    // If minimal withdrawal fails, then return 0
    return 0n;
  }

  // Then, try to withdraw the full balance
  try {
    simulationCount++;
    await simulateWithdraw({
      txArgs,
      amount: accountBalanceUnderlying,
    });

    // If full withdrawal succeeds, then return the full balance
    return accountBalanceUnderlying;
  } catch (error) {
    // If full withdrawal fails, proceed with binary search
  }

  let maxInstantWithdrawAmount = 0n;

  /**
   * Binary search function to find maximum withdrawable amount
   * @param low - Lower bound for search
   * @param high - Upper bound for search
   * @returns Promise<bigint> - The maximum amount that can be withdrawn
   */
  const binarySearch = async (low: bigint, high: bigint): Promise<bigint> => {
    simulationCount++;

    if (simulationCount > maxSimulationCount || low >= high) {
      return maxInstantWithdrawAmount;
    }

    const mid = (low + high) / 2n;

    try {
      await simulateWithdraw({
        txArgs,
        amount: mid,
      });
      // If withdrawal succeeds, update max amount and search in upper half
      maxInstantWithdrawAmount = mid;
      // If we're very close to the upper bound, we've found the optimal amount
      if (high - mid <= 1n) {
        return maxInstantWithdrawAmount;
      }
      return await binarySearch(mid + 1n, high);
    } catch (error) {
      // If withdrawal fails, search in lower half
      return await binarySearch(low, mid);
    }
  };

  return binarySearch(0n, accountBalanceUnderlying);
};

interface WithdrawArgs {
  txArgs: TxArgs;
  amount: bigint;
}

/**
 * Simulates a withdrawal transaction without executing it on-chain
 * @param chainId - The chain ID
 * @param publicClient - Viem public client for contract simulation
 * @param fusionVaultAddress - Address of the Fusion Vault contract
 * @param accountAddress - Address of the account attempting withdrawal
 * @param amount - The amount to withdraw
 * @returns Promise<any> - The simulation result
 * @throws Error if the public client is connected to the wrong chain
 */
const simulateWithdraw = async ({
  txArgs: { publicClient, fusionVaultAddress, accountAddress },
  amount,
}: WithdrawArgs) => {
  await publicClient.simulateContract({
    address: fusionVaultAddress,
    abi: erc4626Abi,
    functionName: 'withdraw',
    account: accountAddress,
    args: [amount, accountAddress, accountAddress],
  });
};
