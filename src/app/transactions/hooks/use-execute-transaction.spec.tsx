import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { type Hash } from 'viem';
import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { useConfigContext } from '@/app/config/config.context';
import { mainnet } from 'viem/chains';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { useAppSetup } from '@/app/use-app-setup';

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;

vi.mock('@/app/config/config.context');
vi.mock('@/app/use-app-setup');

const defaultExecuteTransactionSetup = {
  publicClient: {
    waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'success' }),
  } as any,
  accountAddress: ACCOUNT_ADDRESS,
  isWrongWalletChain: false,
  isSafeWallet: false,
  walletClient: vi.fn() as any,
  switchChain: vi.fn(),
  queryClient: vi.fn() as any,
}

describe('useExecuteTransaction', () => {
  const onInit = vi.fn();
  const onConfirm = vi.fn();
  const onSuccess = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useConfigContext as Mock<typeof useConfigContext>).mockReturnValue({
      chainId: CHAIN.id,
      fusionVaultAddress: PLASMA_VAULT_ADDRESS,
    });
    (useAppSetup as Mock<typeof useAppSetup>)
      .mockReturnValue(defaultExecuteTransactionSetup);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls handlers on successful transaction', async () => {
    const writeAsync = vi.fn(async () => '__TEST_HASH__' as Hash);

    const { result } = renderHook(() =>
      useExecuteTransaction({
        writeAsync,
        transactionStateHandlers: { onInit, onConfirm, onSuccess, onError },
      }),
    );

    await act(async () => {
      await result.current.execute?.();
    });

    expect(onInit).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith({ hash: '__TEST_HASH__' });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith({ hash: '__TEST_HASH__', receipt: { status: 'success' } });
    expect(onError).not.toHaveBeenCalled();
    expect(writeAsync).toHaveBeenCalledTimes(1);
  });

  it('throws and reports when wallet is on wrong chain', async () => {
    (useAppSetup as Mock<typeof useAppSetup>)
      .mockReturnValue({
        ...defaultExecuteTransactionSetup,
        isWrongWalletChain: true,
      });

    const writeAsync = vi.fn(async () => '__TEST_HASH__' as Hash);
    const { result } = renderHook(() =>
      useExecuteTransaction({
        writeAsync,
        transactionStateHandlers: { onInit, onConfirm, onSuccess, onError },
      }),
    );

    await expect(result.current.execute?.()).rejects.toThrow('Wrong wallet chain');
    expect(onInit).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].hash).toBeUndefined();
    expect(onError.mock.calls[0][0].receipt).toBeUndefined();
  });

  it('is disabled when enabled=false', () => {
    const { result } = renderHook(() =>
      useExecuteTransaction({
        writeAsync: async () => '__TEST_HASH__' as Hash,
        transactionStateHandlers: {},
        enabled: false,
      }),
    );
    expect(result.current.execute).toBeUndefined();
  });
});
