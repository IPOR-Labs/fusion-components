import { useParams } from '../hybrid-withdraw.params';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { HybridWithdraw } from '../hybrid-withdraw';
import { parseEther } from 'viem';
import { getNow } from '@/lib/get-now';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { mainnet } from 'viem/chains';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { useConfigContext } from '@/app/config/config.context';
import { sleep } from '@/lib/sleep';
import { useAppSetup } from '@/app/use-app-setup';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';

vi.mock('../hybrid-withdraw.params');
vi.mock('@/lib/get-now');
vi.mock('@/app/config/config.context');
vi.mock('@/app/transactions/utils/send-app-transaction');
vi.mock('@/app/use-app-setup');

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = ANVIL_TEST_ACCOUNT[2].address;
const WITHDRAW_MANAGER_ADDRESS = ANVIL_TEST_ACCOUNT[3].address;

const NOW_DATE = new Date('2024-09-19T16:03:17.000Z');
const ONE_DAY_IN_SECONDS = 60n * 60n * 24n;
const FOUR_DAYS_IN_SECONDS = ONE_DAY_IN_SECONDS * 4n;

describe('Request withdrawal from Plasma Vault', () => {
  it('should allow user to request withdrawal successfuly', async () => {
    (getNow as Mock).mockReturnValue(NOW_DATE);
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
      assetDecimals: 6,
      assetSymbol: 'USDC',
      assetAddress: ASSET_ADDRESS,
      balanceToWithdraw: 3000_000000n,
      isWrongWalletChain: false,
      accountAddress: ACCOUNT_ADDRESS,
      withdrawWindowInSeconds: FOUR_DAYS_IN_SECONDS,
      withdrawManagerAddress: WITHDRAW_MANAGER_ADDRESS,
      isWithdrawRequestPending: false,
      withdrawFee: parseEther('0.0033'),
      requestFee: parseEther('0.00828'),
      maxInstantWithdrawAmount: 0n,
      sharesBalance: 2000_00000000n,
      convertToShares: () => Promise.resolve(1000_00000000n),
      isRedeemPaused: false,
      isRequestSharesPaused: false,
      isWithdrawPaused: false,
    });
    (sendAppTransaction as Mock).mockResolvedValue('__TX_HASH__');

    render(<HybridWithdraw />);

    const redeemAmountInput = screen.getByRole('textbox');
    expect(redeemAmountInput).toHaveValue('');

    act(() => {
      fireEvent.change(redeemAmountInput, { target: { value: '2000' } });
    });
    expect(redeemAmountInput).toHaveValue('2000');

    await sleep(500);

    const scheduledWithdrawFee = screen.getByTestId('scheduled-withdraw-fee');
    expect(scheduledWithdrawFee).toHaveTextContent(
      '0.82% Scheduled Withdrawal Fee',
    );
    expect(scheduledWithdrawFee).toHaveTextContent('16.56 USDC');

    const withdrawButton = screen.getByRole('button', {
      name: 'Schedule Withdrawal',
    });
    expect(withdrawButton).toBeEnabled();

    expect(sendAppTransaction).toBeCalledTimes(0);

    act(() => {
      fireEvent.click(withdrawButton);
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
        abi: withdrawManagerAbi,
        account: ACCOUNT_ADDRESS,
        address: WITHDRAW_MANAGER_ADDRESS,
        args: [1000_00000000n],
        functionName: 'requestShares',
      },
    });
  });
});
