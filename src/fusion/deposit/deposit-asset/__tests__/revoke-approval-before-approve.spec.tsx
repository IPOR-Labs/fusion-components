import { useParams as useDepositParams } from '../deposit-asset.params';
import { describe, expect, it, type Mock, vi } from 'vitest';
import {
  render,
  screen,
  act,
  fireEvent,
} from '@testing-library/react';
import { DepositAsset } from '../deposit-asset';
import { mainnet } from 'viem/chains';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { sleep } from '@/lib/sleep';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { useAppSetup } from '@/app/use-app-setup';
import { useConfigContext } from '@/app/config/config.context';
import { USDT_ADDRESS_MAINNET } from '@/lib/constants';

vi.mock('../deposit-asset.params');
vi.mock('@/app/config/config.context');
vi.mock('@/app/transactions/utils/send-app-transaction');
vi.mock('@/app/use-app-setup');

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = USDT_ADDRESS_MAINNET;

describe('User has to revoke Approval before Plasma Vault approve for USDT', () => {
  it('should show revoke approve modal', async () => {
    (useAppSetup as Mock<typeof useAppSetup>).mockReturnValue({
      publicClient: {
        waitForTransactionReceipt: vi.fn().mockResolvedValue({ 
          status: 'success',
          logs: [],
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
    (useDepositParams as Mock<typeof useDepositParams>).mockReturnValue({
      vaultName: 'IPOR Fusion Plasma Vault USDT',
      vaultSymbol: 'ipfUSDT',
      assetDecimals: 6,
      isWhitelisted: true,
      assetAddress: ASSET_ADDRESS,
      assetSymbol: 'USDT',
      allowance: 1000_000000n,
      assetBalance: 2000_000000n,
      setAllowanceFromEvent: vi.fn(),
      withdrawWindowInSeconds: 0n,
      isScheduledWithdrawal: false,
      maxDeposit: 2000_000000n,
      isDepositPaused: false,
    });
    (sendAppTransaction as Mock).mockResolvedValue('__TX_HASH__');

    render(<DepositAsset />);

    const depositAmountInput = screen.getByRole('textbox');
    expect(depositAmountInput).toHaveValue('');

    act(() => {
      fireEvent.change(depositAmountInput, { target: { value: '2000' } });
    });
    expect(depositAmountInput).toHaveValue('2,000');

    await sleep(100);

    const placeholderButton = screen.getByRole('button', {
      name: 'Approve',
    });
    expect(placeholderButton).toBeDisabled();

    const revokeApprovalButton = screen.getByRole('button', {
      name: 'Revoke Approval',
    });
    expect(revokeApprovalButton).toBeEnabled();

    expect(sendAppTransaction).toBeCalledTimes(0);

    act(() => {
      fireEvent.click(revokeApprovalButton);
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
        abi: expect.any(Object),
        account: ACCOUNT_ADDRESS,
        address: ASSET_ADDRESS,
        args: [PLASMA_VAULT_ADDRESS, 0n],
        functionName: 'approve',
      },
    });
  });
});
