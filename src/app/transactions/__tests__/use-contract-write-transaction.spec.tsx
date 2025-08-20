import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useContractWriteTransaction } from '@/app/transactions/use-contract-write-transaction';
import { sleep } from '@/utils/sleep';
import { type Hash } from 'viem';

const onErrorSpy = vi.fn();
const onConfirmSpy = vi.fn();
const onInitSpy = vi.fn();
const onSuccessSpy = vi.fn();

const addTransactionSpy = vi.fn();
const updateTransactionSpy = vi.fn();

vi.mock('@/transactions/setup');
vi.mock('@/wallet/utils/isSafeApp', () => ({
  isSafeApp: false,
}));

describe('useContractWriteTransaction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.runAllTimersAsync();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should invoke transaction state handlers if tx succeeds', async () => {
    // (useSetup as Mock).mockReturnValue({
    //   explorerUrl: '__TEST_EXPLORER_URL__',
    //   publicClient: {},
    //   writeContractAsync: vi.fn(),
    //   isSafeWallet: false,
    //   accountAddress: '0x6f4c07cd140e1a79e73727770f249822933ba76b',
    //   isWrongWalletChain: false,
    //   ethPrice: 999n,
    //   queryClient: { invalidateQueries: vi.fn() },
    //   addTransaction: addTransactionSpy,
    //   updateTransaction: updateTransactionSpy,
    //   getReceipt: async () => ({
    //     status: 'success',
    //     gasUsed: 111111111n,
    //     effectiveGasPrice: 444444444444n,
    //   }),
    //   getTransaction: async () => ({
    //     gas: 22222222222n,
    //     gasPrice: 33333333333n,
    //   }),
    // });

    const hookResult = useContractWriteTransaction({
      chainId: 1,
      transactionStateHandlers: {
        onError: onErrorSpy,
        onConfirm: onConfirmSpy,
        onInit: onInitSpy,
        onSuccess: onSuccessSpy,
      },
      writeAsync: async () => {
        return '__TEST_HASH__' as Hash;
      },
    });

    expect(onErrorSpy).toBeCalledTimes(0);
    expect(onInitSpy).toBeCalledTimes(0);
    expect(onConfirmSpy).toBeCalledTimes(0);
    expect(onSuccessSpy).toBeCalledTimes(0);

    expect(addTransactionSpy).toBeCalledTimes(0);
    expect(updateTransactionSpy).toBeCalledTimes(0);

    hookResult.execute?.();

    await sleep(9500);

    expect(onErrorSpy).toBeCalledTimes(0);
    expect(onInitSpy).toBeCalledTimes(1);
    expect(onConfirmSpy).toBeCalledTimes(1);
    expect(onSuccessSpy).toBeCalledTimes(1);

    expect(addTransactionSpy).toBeCalledTimes(1);
    expect(updateTransactionSpy).toBeCalledTimes(1);

    expect(addTransactionSpy).toBeCalledWith({
      type: 'openSwap',
      chainId: 1,
      hash: '__TEST_HASH__',
      data: {
        state: 'pending',
      },
    });
    expect(updateTransactionSpy).toBeCalledWith('__TEST_HASH__', {
      state: 'success',
      savedGasCost: 690666n,
    });
  });

  it('should not execute and handle error if walletChainAddress is undefined (wrong chain)', async () => {
    // (useSetup as Mock).mockReturnValue({
    //   explorerUrl: '__TEST_EXPLORER_URL__',
    //   isWrongWalletChain: true,
    //   ethPrice: 999n,
    //   publicClient: {},
    //   writeContractAsync: vi.fn(),
    //   isSafeWallet: false,
    //   accountAddress: '0x6f4c07cd140e1a79e73727770f249822933ba76b',
    //   queryClient: undefined,
    //   addTransaction: addTransactionSpy,
    //   updateTransaction: updateTransactionSpy,
    //   getReceipt: undefined,
    //   getTransaction: undefined,
    // });

    const hookResult = useContractWriteTransaction({
      chainId: 1,
      transactionStateHandlers: {
        onError: onErrorSpy,
      },
      writeAsync: async () => {
        return '__TEST_HASH__' as Hash;
      },
    });

    expect(onErrorSpy).toBeCalledTimes(0);
    expect(onInitSpy).toBeCalledTimes(0);
    expect(onConfirmSpy).toBeCalledTimes(0);
    expect(onSuccessSpy).toBeCalledTimes(0);

    expect(addTransactionSpy).toBeCalledTimes(0);
    expect(updateTransactionSpy).toBeCalledTimes(0);

    await expect(hookResult.execute?.()).rejects.toEqual(
      new Error('DAPP_WRONG_WALLET_CHAIN'),
    );

    expect(onErrorSpy).toBeCalledTimes(1);
    expect(onInitSpy).toBeCalledTimes(0);
    expect(onConfirmSpy).toBeCalledTimes(0);
    expect(onSuccessSpy).toBeCalledTimes(0);

    expect(addTransactionSpy).toBeCalledTimes(0);
    expect(updateTransactionSpy).toBeCalledTimes(0);

    expect(onErrorSpy).toBeCalledWith({
      code: 'DAPP_WRONG_WALLET_CHAIN',
      eventId: undefined,
      message: 'Your wallet is connected to wrong chain',
      originalError: new Error('DAPP_WRONG_WALLET_CHAIN'),
    });
  });
});
