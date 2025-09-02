import { useParams } from '../hybrid-withdraw.params';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HybridWithdraw } from '../hybrid-withdraw';
import { mainnet } from 'viem/chains';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { sleep } from '@/lib/sleep';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { useAppSetup } from '@/app/use-app-setup';
import { useConfigContext } from '@/app/config/config.context';

vi.mock('../hybrid-withdraw.params');
vi.mock('@/app/config/config.context');
vi.mock('@/app/transactions/utils/send-app-transaction');
vi.mock('@/app/use-app-setup');

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = ANVIL_TEST_ACCOUNT[2].address;

describe('Withdraw ALL shares from Plasma Vault', () => {
  it('should allow user to withdraw ALL shares successfuly', async () => {
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
      isWithdrawRequestPending: false,
      withdrawManagerAddress: undefined,
      withdrawWindowInSeconds: undefined,
      withdrawFee: undefined,
      requestFee: undefined,
      maxInstantWithdrawAmount: 10000_000000n,
      sharesBalance: 2333_00000000n,
      convertToShares: () => Promise.resolve(2333_00000000n),
      isRedeemPaused: false,
      isRequestSharesPaused: false,
      isWithdrawPaused: false,
    });
    (sendAppTransaction as Mock).mockResolvedValue('__TX_HASH__');

    render(<HybridWithdraw />);

    const user = userEvent.setup();

    const redeemAmountInput = screen.getByRole('textbox');
    expect(redeemAmountInput).toHaveValue('');

    const _100PercentButton = screen.getByRole('button', {
      name: '100%',
    });
    await user.click(_100PercentButton);
    expect(redeemAmountInput).toHaveValue('3000');

    await sleep(500);

    const withdrawButton = screen.getByRole('button', {
      name: 'Withdraw All Now',
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
        args: [2333_00000000n, ACCOUNT_ADDRESS, ACCOUNT_ADDRESS],
        functionName: 'redeem',
      },
    });
  });
});
