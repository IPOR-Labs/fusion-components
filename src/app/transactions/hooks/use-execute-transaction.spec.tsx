import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { type Address, type Hash } from 'viem';
import { type ChainId } from '@/app/config/wagmi';
import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { useConfigContext } from '@/app/config/config.context';
import { mainnet } from 'viem/chains';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;

// Reconfigurable mocks
const useIsWrongWalletChainMock = vi
  .fn<(chainId: ChainId) => boolean>()
  .mockReturnValue(false);

// Module mocks
vi.mock('wagmi', () => {
  const waitForTransactionReceipt = vi
    .fn()
    .mockResolvedValue({ status: 'success' });
  return {
    usePublicClient: vi.fn(() => ({ waitForTransactionReceipt })),
  } as any;
});

vi.mock('@/app/wallet/hooks/use-app-wallet-client', () => ({
  useAppWalletClient: () => ({} as any),
}));

vi.mock('@/app/wallet/hooks/use-is-safe-wallet', () => ({
  useIsSafeWallet: () => false,
}));

vi.mock('@/app/wallet/hooks', () => ({
  useIsWrongWalletChain: (chainId: ChainId) => useIsWrongWalletChainMock(chainId),
}));

vi.mock('@/app/wallet/hooks/use-wallet-account-address', () => ({
  useWalletAccountAddress: () =>
    '0x1111111111111111111111111111111111111111' as Address,
}));

vi.mock('@/app/config/config.context');

describe('useExecuteTransaction', () => {
  const onInit = vi.fn();
  const onConfirm = vi.fn();
  const onSuccess = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useIsWrongWalletChainMock.mockReturnValue(false);
    (useConfigContext as Mock<typeof useConfigContext>).mockReturnValue({
      chainId: CHAIN.id,
      fusionVaultAddress: PLASMA_VAULT_ADDRESS,
    });
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
    useIsWrongWalletChainMock.mockReturnValue(true);

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
