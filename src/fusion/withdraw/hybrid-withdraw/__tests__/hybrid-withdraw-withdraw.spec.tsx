import { useParams } from '../hybrid-withdraw.params';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { HybridWithdraw } from '../hybrid-withdraw';
import { parseEther } from 'viem';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { mainnet } from 'viem/chains';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { useConfigContext } from '@/app/config/config.context';
import { sleep } from '@/lib/sleep';
import { useExecuteTransactionSetup } from '@/app/transactions/hooks/use-execute-transaction-setup';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';

vi.mock('../hybrid-withdraw.params');
vi.mock('@/lib/get-now');
vi.mock('@/app/config/config.context');
vi.mock('@/app/transactions/utils/send-app-transaction');
vi.mock('@/app/transactions/hooks/use-execute-transaction-setup');

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = ANVIL_TEST_ACCOUNT[2].address;

describe('Withdraw asset from Plasma Vault', () => {
  it('should allow user to withdraw assets successfuly', async () => {
    (useExecuteTransactionSetup as Mock<typeof useExecuteTransactionSetup>).mockReturnValue({
      publicClient: {
        waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: 'success' }),
      } as any,
      accountAddress: ACCOUNT_ADDRESS,
      isWrongWalletChain: false,
      isSafeWallet: false,
      walletClient: vi.fn() as any,
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
      switchChain: vi.fn(),
      onConfirm: vi.fn(),
      isWithdrawRequestPending: false,
      withdrawManagerAddress: undefined,
      withdrawWindowInSeconds: undefined,
      withdrawFee: parseEther('0.0033'),
      requestFee: parseEther('0.00828'),
      maxInstantWithdrawAmount: 10000_000000n,
      sharesBalance: 2000_00000000n,
      convertToShares: () => Promise.resolve(2000_00000000n),
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

    const scheduledWithdrawFee = screen.getByTestId('instant-withdraw-fee');
    expect(scheduledWithdrawFee).toHaveTextContent('0.33% Withdrawal Fee');
    expect(scheduledWithdrawFee).toHaveTextContent('6.6 USDC');

    const withdrawButton = screen.getByRole('button', {
      name: 'Withdraw Now',
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
        abi: plasmaVaultAbi,
        account: ACCOUNT_ADDRESS,
        address: PLASMA_VAULT_ADDRESS,
        args: [2000_000000n, ACCOUNT_ADDRESS, ACCOUNT_ADDRESS],
        functionName: 'withdraw',
      },
    });
  });
});
