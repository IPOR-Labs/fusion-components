import { describe, expect, it, type Mock, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fromUnixTime } from 'date-fns';
import { useParams, type Params } from '@/fusion/withdraw/redeem-from-request/redeem-from-request.params';
import { parseEther } from 'viem';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { mainnet } from 'viem/chains';
import { RedeemFromRequest } from '@/fusion/withdraw/redeem-from-request/redeem-from-request';
import { getNow } from '@/lib/get-now';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { useAppSetup } from '@/app/use-app-setup';
import { useConfigContext } from '@/app/config/config.context';
import { cleanup } from '@testing-library/react'

vi.mock('@/fusion/withdraw/redeem-from-request/redeem-from-request.params');
vi.mock('@/app/config/config.context');
vi.mock('@/app/transactions/utils/send-app-transaction');
vi.mock('@/app/use-app-setup');
vi.mock('@/lib/get-now');

const CHAIN = mainnet;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ACCOUNT_ADDRESS = ANVIL_TEST_ACCOUNT[1].address;
const ASSET_ADDRESS = ANVIL_TEST_ACCOUNT[2].address;

const NOW_TIMESTAMP = 1732032197; // 2024-11-19T14:43:17.000Z
const NOW_DATE = new Date(fromUnixTime(NOW_TIMESTAMP));
const ONE_DAY_IN_SECONDS = 60n * 60n * 24n;
const EIGHT_HOURS_IN_SECONDS = ONE_DAY_IN_SECONDS / 3n;
const FOUR_DAYS_IN_SECONDS = ONE_DAY_IN_SECONDS * 4n;

const DEFAULT_PARAMS: Params = {
  assetDecimals: 6,
  canWithdraw: true,
  requestedAmount: 1888_000000n,
  requestedAssets: 1023_000000n,
  assetAddress: ASSET_ADDRESS,
  underlyingAssetPrice: parseEther('1'),
  showBalanceInDollars: false,
  assetSymbol: 'USDC',
  // 8 hours from now
  endWithdrawWindowTimestamp: BigInt(NOW_TIMESTAMP) + EIGHT_HOURS_IN_SECONDS,
  withdrawWindowInSeconds: ONE_DAY_IN_SECONDS,
  isRedeemFromRequestPaused: false,
};

describe('Redeem from request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    (sendAppTransaction as Mock).mockResolvedValue('__TX_HASH__');
    (getNow as Mock).mockReturnValue(NOW_DATE);
  });

  afterEach(() => {
    cleanup()
  });

  it('should allow user to withdraw assets successfuly when can withdraw and request is matured', async () => {
    (useParams as Mock<typeof useParams>).mockReturnValue(DEFAULT_PARAMS);

    render(<RedeemFromRequest />);

    screen.getByText('1,023');
    const expiresIn = screen.getByRole('paragraph');
    expect(expiresIn).toHaveTextContent('Withdrawal request expires in');
    expect(expiresIn).toHaveTextContent('8h');

    const user = userEvent.setup();

    const redeemButton = screen.getByRole('button', {
      name: 'Redeem',
    });
    expect(redeemButton).toBeEnabled();

    expect(sendAppTransaction).toBeCalledTimes(0);

    await user.click(redeemButton);

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
        address: PLASMA_VAULT_ADDRESS,
        args: [1888_000000n, ACCOUNT_ADDRESS, ACCOUNT_ADDRESS],
        functionName: 'redeemFromRequest',
      },
    });
  });

  it('should NOT allow user to withdraw when Alpha did not invoke releaseFunds on WithdrawManager smart contract', async () => {
    (useParams as Mock<typeof useParams>).mockReturnValue({
      ...DEFAULT_PARAMS,
      canWithdraw: false,
    });

    render(<RedeemFromRequest />);

    screen.getByText('1,023');
    screen.getByText('Withdrawal request is not ready yet.');

    const redeemButton = screen.getByRole('button', {
      name: 'Redeem',
    });
    expect(redeemButton).toBeDisabled();
  });

  it('should render nothing when requested amount is undefined', async () => {
    (useParams as Mock<typeof useParams>).mockReturnValue({
      ...DEFAULT_PARAMS,
      requestedAmount: undefined,
      requestedAssets: undefined,
    });

    const { container } = render(<RedeemFromRequest />);
    expect(container.firstChild).toBeNull();
  });

  it('should NOT allow user to withdraw when request is expired', async () => {
    (useParams as Mock<typeof useParams>).mockReturnValue({
      ...DEFAULT_PARAMS,
      // 1 day ago
      endWithdrawWindowTimestamp: BigInt(NOW_TIMESTAMP) - ONE_DAY_IN_SECONDS,
    });

    render(<RedeemFromRequest />);

    screen.getByText('Withdrawal request of');
    screen.getByText('1,023');
    screen.getByText('USDC has expired.');

    const redeemButton = screen.queryByRole('button', {
      name: 'Redeem',
    });
    expect(redeemButton).not.toBeInTheDocument();
  });

  it('should NOT allow user to withdraw when waiting for maturity', async () => {
    (useParams as Mock<typeof useParams>).mockReturnValue({
      ...DEFAULT_PARAMS,
      canWithdraw: false,
      // 4 days from now
      endWithdrawWindowTimestamp: BigInt(NOW_TIMESTAMP) + FOUR_DAYS_IN_SECONDS,
      withdrawWindowInSeconds: ONE_DAY_IN_SECONDS,
    });

    render(<RedeemFromRequest />);

    screen.getByText('1,023');
    const paragraphs = screen.getAllByRole('paragraph');
    expect(paragraphs[0]).toHaveTextContent('Alpha prepping assets...');
    expect(paragraphs[1]).toHaveTextContent('pending (3d 12h estimated)');
    expect(paragraphs[2]).toHaveTextContent('Redeem deadline in');
    expect(paragraphs[3]).toHaveTextContent('4d');

    const redeemButton = screen.getByRole('button', {
      name: 'Redeem',
    });
    expect(redeemButton).toBeDisabled();
  });

  it('should allow user to withdraw assets successfuly when can withdraw but request is NOT matured', async () => {
    (useParams as Mock<typeof useParams>).mockReturnValue({
      ...DEFAULT_PARAMS,
      endWithdrawWindowTimestamp: BigInt(NOW_TIMESTAMP) + FOUR_DAYS_IN_SECONDS,
      withdrawWindowInSeconds: ONE_DAY_IN_SECONDS,
    });

    render(<RedeemFromRequest />);

    screen.getByText('1,023');
    const expiresIn = screen.getByRole('paragraph');
    expect(expiresIn).toHaveTextContent('Withdrawal request expires in');
    expect(expiresIn).toHaveTextContent('4d');

    const user = userEvent.setup();

    const redeemButton = screen.getByRole('button', {
      name: 'Redeem',
    });
    expect(redeemButton).toBeEnabled();

    expect(sendAppTransaction).toBeCalledTimes(0);

    await user.click(redeemButton);

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
        address: PLASMA_VAULT_ADDRESS,
        args: [1888_000000n, ACCOUNT_ADDRESS, ACCOUNT_ADDRESS],
        functionName: 'redeemFromRequest',
      },
    });
  });
});
