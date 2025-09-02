import { useParams } from '../deposit-asset.params';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DepositAsset } from '../deposit-asset';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { useAppSetup } from '@/app/use-app-setup';
import { mainnet } from 'viem/chains';
import { sleep } from '@/lib/sleep';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { erc20Abi } from 'viem';
import { useConfigContext } from '@/app/config/config.context';

vi.mock('../deposit-asset.params');
vi.mock('@/app/config/config.context');
vi.mock('@/app/transactions/utils/send-app-transaction');
vi.mock('@/app/use-app-setup');

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = ANVIL_TEST_ACCOUNT[2].address;

describe('User has to reapprove Plasma Vault when setting custom allowance < total', () => {
  it('should not let user click deposit', async () => {
    (useAppSetup as Mock<typeof useAppSetup>).mockReturnValue({
      publicClient: {
        waitForTransactionReceipt: vi.fn().mockResolvedValue({
          status: 'success',
          logs: [{}],
        }),
      } as any,
      accountAddress: ACCOUNT_ADDRESS,
      isWrongWalletChain: false,
      isSafeWallet: false,
      walletClient: vi.fn() as any,
      switchChain: vi.fn(),
      queryClient: vi.fn() as any,
    });
    (useConfigContext as Mock<typeof useConfigContext>).mockReturnValue({
      chainId: CHAIN.id,
      fusionVaultAddress: PLASMA_VAULT_ADDRESS,
    });
    (useParams as Mock<typeof useParams>).mockReturnValue({
      assetSymbol: 'USDC',
      assetAddress: ASSET_ADDRESS,
      vaultName: 'IPOR Fusion Plasma Vault USDC',
      vaultSymbol: 'ipfUSDC',
      assetDecimals: 6,
      isWhitelisted: true,
      allowance: 0n,
      assetBalance: 1000_000000n,
      setAllowanceFromEvent: vi.fn(),
      withdrawWindowInSeconds: 0n,
      isScheduledWithdrawal: false,
      maxDeposit: 1000_000000n,
      isDepositPaused: false,
    });
    (sendAppTransaction as Mock).mockResolvedValue('__TX_HASH__');

    render(<DepositAsset />);

    const depositAmountInput = screen.getByRole('textbox');
    expect(depositAmountInput).toHaveValue('');

    act(() => {
      fireEvent.change(depositAmountInput, { target: { value: '1000' } });
    });
    expect(depositAmountInput).toHaveValue('1000');

    await sleep(100);

    const depositButton = screen.getByRole('button', {
      name: 'Deposit',
    });
    expect(depositButton).toBeDisabled();

    const approveButton = screen.getByRole('button', {
      name: 'Approve',
    });
    expect(approveButton).toBeEnabled();

    expect(sendAppTransaction).toBeCalledTimes(0);

    act(() => {
      fireEvent.click(approveButton);
    });

    await sleep(100);

    expect(sendAppTransaction).toBeCalledTimes(1);

    expect(sendAppTransaction).toBeCalledWith({
      config: {
        publicClient: expect.any(Object),
        walletClient: expect.any(Function),
        bypassGasEstimation: false,
      },
      parameters: {
        abi: erc20Abi,
        account: ACCOUNT_ADDRESS,
        address: ASSET_ADDRESS,
        args: [PLASMA_VAULT_ADDRESS, 1000000000n],
        functionName: 'approve',
      },
    });
  });
});
