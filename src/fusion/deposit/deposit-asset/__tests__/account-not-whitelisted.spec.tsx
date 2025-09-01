import { useParams } from '../deposit-asset.params';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DepositAsset } from '../deposit-asset';
import { mainnet } from 'viem/chains';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { useExecuteTransactionSetup } from '@/app/transactions/hooks/use-execute-transaction-setup';

vi.mock('../deposit-asset.params');
vi.mock('@/app/config/config.context');
vi.mock('@/app/transactions/hooks/use-execute-transaction-setup');

const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = ANVIL_TEST_ACCOUNT[2].address;

describe('Account is not whitelisted to deposit to Plasma Vault', () => {
  it('should NOT allow user to perfom any transaction', async () => {
    (useExecuteTransactionSetup as Mock<typeof useExecuteTransactionSetup>).mockReturnValue({
      publicClient: {
        waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'success' }),
      } as any,
      accountAddress: ACCOUNT_ADDRESS,
      isWrongWalletChain: false,
      isSafeWallet: false,
      walletClient: vi.fn() as any,
    });
    (useParams as Mock<typeof useParams>).mockReturnValue({
      chainId: mainnet.id,
      assetSymbol: 'USDC',
      fusionVaultAddress: PLASMA_VAULT_ADDRESS,
      assetAddress: ASSET_ADDRESS,
      vaultName: 'IPOR Fusion Plasma Vault USDC',
      vaultSymbol: 'ipfUSDC',
      assetDecimals: 6,
      isWrongWalletChain: false,
      accountAddress: ACCOUNT_ADDRESS,
      allowance: 0n,
      assetBalance: 2000_000000n,
      isWhitelisted: false,
      connect: vi.fn(),
      onConfirm: vi.fn(),
      onDepositSuccess: vi.fn(),
      switchChain: vi.fn(),
      hideRevokingUsdtAllowance: vi.fn(),
      showRevokingUsdtAllowance: vi.fn(),
      setAllowanceFromEvent: vi.fn(),
      withdrawWindowInSeconds: 0n,
      isScheduledWithdrawal: false,
      maxDeposit: 2000_000000n,
      isRevokingUsdtAllowance: false,
    });
    render(<DepositAsset />);

    const depositAmountInput = screen.getByRole('textbox');
    expect(depositAmountInput).toHaveValue('');

    act(() => {
      fireEvent.change(depositAmountInput, { target: { value: '2000' } });
    });
    expect(depositAmountInput).toHaveValue('2000');

    const transferDepositButton = screen.getByRole('button', {
      name: 'Deposit',
    });
    expect(transferDepositButton).toBeDisabled();

    const approveButton = screen.getByRole('button', {
      name: 'Approve',
    });
    expect(approveButton).toBeDisabled();

    screen.getByText('You are not whitelisted');
  });
});
