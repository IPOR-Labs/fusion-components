import { describe, it, expect, vi, type Mock } from 'vitest';
import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { erc20Abi } from 'viem';
import { arbitrum, mainnet } from 'viem/chains';
import { getGasPriceBlockNative } from '@/utils/getGasPriceBlockNative';

vi.mock('@/utils/getGasPriceBlockNative');
vi.mock('viem/actions');

const GAS_PRICE_RESULT_MOCK = [
  {
    blockPrices: [
      {
        estimatedPrices: [
          {
            confidence: 70,
            maxFeePerGas: 777,
            maxPriorityFeePerGas: 8.88,
            price: 1,
          },
        ],
      },
    ],
  },
];

const CONTRACT_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC
const SPENDER_ADDRESS = '0x16d104009964e694761C0bf09d7Be49B7E3C26fd';
const ACCOUNT_ADDRESS = '0xA6A7B66EbBb5CbfDFf3C83781193618ee4E22f4D';

const writeContractAsyncSpy = vi
  .fn()
  .mockResolvedValue('WRITE_CONTRACT_RESULT_MOCK');

describe('sendAppTransaction', () => {
  it('should send a transaction for Ethereum mainnet chainId: 1', async () => {
    (getGasPriceBlockNative as Mock).mockResolvedValueOnce(
      GAS_PRICE_RESULT_MOCK,
    );
    const estimateContractGasSpy = vi.fn().mockResolvedValue(44444n);
    const simulateContractSpy = vi.fn().mockResolvedValue({
      request: 'SIMULATION_REQUEST_MOCK',
    });
    const publicClientSpy = {
      chain: mainnet,
      estimateContractGas: estimateContractGasSpy,
      simulateContract: simulateContractSpy,
    };

    const tx = sendAppTransaction({
      config: {
        // @ts-expect-error
        publicClient: publicClientSpy,
        writeContractAsync: writeContractAsyncSpy,
        bypassGasEstimation: false,
      },
      parameters: {
        address: CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        account: ACCOUNT_ADDRESS,
        args: [SPENDER_ADDRESS, 987n],
      },
    });

    await expect(tx).resolves.toBe('WRITE_CONTRACT_RESULT_MOCK');

    expect(getGasPriceBlockNative).toBeCalledTimes(1);
    expect(estimateContractGasSpy).toBeCalledTimes(1);

    expect(simulateContractSpy).toBeCalledTimes(1);
    expect(simulateContractSpy).lastCalledWith({
      abi: erc20Abi,
      account: ACCOUNT_ADDRESS,
      address: CONTRACT_ADDRESS,
      args: [SPENDER_ADDRESS, 987n],
      functionName: 'approve',
      gas: 48888n,
      maxFeePerGas: 777000000000n,
      maxPriorityFeePerGas: 8880000000n,
    });

    expect(writeContractAsyncSpy).toBeCalledTimes(1);
    expect(writeContractAsyncSpy).lastCalledWith('SIMULATION_REQUEST_MOCK');
  });

  it('should send a transaction for Arbitrum chainId: 42161', async () => {
    const estimateContractGasSpy = vi.fn().mockResolvedValue(44444n);
    const simulateContractSpy = vi.fn().mockResolvedValue({
      request: 'SIMULATION_REQUEST_MOCK',
    });
    const publicClientSpy = {
      chain: arbitrum,
      estimateContractGas: estimateContractGasSpy,
      simulateContract: simulateContractSpy,
    };

    const tx = sendAppTransaction({
      config: {
        // @ts-expect-error
        publicClient: publicClientSpy,
        writeContractAsync: writeContractAsyncSpy,
        bypassGasEstimation: false,
      },
      parameters: {
        address: CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        account: ACCOUNT_ADDRESS,
        args: [SPENDER_ADDRESS, 987n],
      },
    });

    await expect(tx).resolves.toBe(undefined);

    expect(getGasPriceBlockNative).toBeCalledTimes(0);
    expect(estimateContractGasSpy).toBeCalledTimes(1);

    expect(simulateContractSpy).toBeCalledTimes(1);
    expect(simulateContractSpy).lastCalledWith({
      abi: erc20Abi,
      account: ACCOUNT_ADDRESS,
      address: CONTRACT_ADDRESS,
      args: [SPENDER_ADDRESS, 987n],
      functionName: 'approve',
      gas: 48888n,
      maxFeePerGas: undefined,
      maxPriorityFeePerGas: undefined,
    });

    expect(writeContractAsyncSpy).toBeCalledTimes(1);
    expect(writeContractAsyncSpy).lastCalledWith('SIMULATION_REQUEST_MOCK');
  });

  it('should set gas parameteres to undefined if bypassGasEstimation = true', async () => {
    (getGasPriceBlockNative as Mock).mockResolvedValueOnce(
      GAS_PRICE_RESULT_MOCK,
    );
    const estimateContractGasSpy = vi.fn().mockResolvedValue(44444n);
    const simulateContractSpy = vi.fn().mockResolvedValue({
      request: 'SIMULATION_REQUEST_MOCK',
    });
    const publicClientSpy = {
      chain: mainnet,
      estimateContractGas: estimateContractGasSpy,
      simulateContract: simulateContractSpy,
    };

    const tx = sendAppTransaction({
      config: {
        // @ts-expect-error
        publicClient: publicClientSpy,
        writeContractAsync: writeContractAsyncSpy,
        bypassGasEstimation: true,
      },
      parameters: {
        address: CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        account: ACCOUNT_ADDRESS,
        args: [SPENDER_ADDRESS, 987n],
      },
    });

    await expect(tx).resolves.toBe(undefined);

    expect(getGasPriceBlockNative).toBeCalledTimes(0);
    expect(estimateContractGasSpy).toBeCalledTimes(0);
    expect(simulateContractSpy).toBeCalledTimes(0);

    expect(writeContractAsyncSpy).toBeCalledTimes(1);
    expect(writeContractAsyncSpy).lastCalledWith({
      abi: erc20Abi,
      account: ACCOUNT_ADDRESS,
      address: CONTRACT_ADDRESS,
      args: [SPENDER_ADDRESS, 987n],
      functionName: 'approve',
    });
  });
});
