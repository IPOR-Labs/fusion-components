import { useParams } from '../deposit-asset.params';
import { describe, expect, it, type Mock, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DepositAsset } from '../deposit-asset';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { mainnet } from 'viem/chains';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { useConfigContext } from '@/app/config/config.context';
import { useAppSetup } from '@/app/use-app-setup';
import { sleep } from '@/lib/sleep';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';

vi.mock('../deposit-asset.params');
vi.mock('@/app/config/config.context');
vi.mock('@/app/transactions/utils/send-app-transaction');
vi.mock('@/app/use-app-setup');

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = ANVIL_TEST_ACCOUNT[2].address;

describe('Deposit asset to Plasma Vault', () => {
  it('should allow user to deposit assets successfuly', async () => {
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
      vaultName: 'IPOR Fusion Plasma Vault USDC',
      assetSymbol: 'USDC',
      assetAddress: ASSET_ADDRESS,
      assetDecimals: 6,
      assetBalance: 2000_000000n,
      isWhitelisted: true,
      allowance: 2000_000000n,
      setAllowanceFromEvent: vi.fn(),
      withdrawWindowInSeconds: 0n,
      isScheduledWithdrawal: false,
      maxDeposit: 2000_000000n,
      vaultSymbol: 'ipfUSDC',
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

    const transferDepositButton = screen.getByRole('button', {
      name: 'Deposit',
    });
    expect(transferDepositButton).toBeEnabled();

    expect(sendAppTransaction).toBeCalledTimes(0);

    act(() => {
      fireEvent.click(transferDepositButton);
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
        args: [2000000000n, ACCOUNT_ADDRESS],
        functionName: 'deposit',
      },
    });
  });
});
