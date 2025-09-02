import { useParams } from '../deposit-asset.params';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DepositAsset } from '../deposit-asset';
import { mainnet } from 'viem/chains';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { useAppSetup } from '@/app/use-app-setup';
import { useConfigContext } from '@/app/config/config.context';

vi.mock('../deposit-asset.params');
vi.mock('@/app/config/config.context');
vi.mock('@/app/use-app-setup');

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = ANVIL_TEST_ACCOUNT[2].address;

describe('Account is not whitelisted to deposit to Plasma Vault', () => {
  it('should NOT allow user to perfom any transaction', async () => {
    (useAppSetup as Mock<typeof useAppSetup>).mockReturnValue({
      publicClient: {
        waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'success' }),
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
      isWrongWalletChain: false,
      accountAddress: ACCOUNT_ADDRESS,
      allowance: 0n,
      assetBalance: 2000_000000n,
      isWhitelisted: false,
      setAllowanceFromEvent: vi.fn(),
      withdrawWindowInSeconds: 0n,
      isScheduledWithdrawal: false,
      maxDeposit: 2000_000000n,
      isDepositPaused: false,
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
