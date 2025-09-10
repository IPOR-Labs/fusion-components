import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { RedeemFromRequestContent } from '@/fusion/withdraw/redeem-from-request/components/redeem-from-request-content';
import { RedeemFromRequestContext } from '@/fusion/withdraw/redeem-from-request/redeem-from-request.context';
import { type Params } from '@/fusion/withdraw/redeem-from-request/redeem-from-request.params';
import { getUnixTime } from 'date-fns';
import { parseEther } from 'viem';
import { useTransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { getNow } from '@/lib/get-now';
import { mainnet } from 'viem/chains';
import { ANVIL_TEST_ACCOUNT } from '@/lib/test-accounts';
import { Providers } from '@/app/config/providers';

const meta = {
  component: RedeemFromRequestContent,
} satisfies Meta<typeof RedeemFromRequestContent>;

export default meta;

type Story = StoryObj<typeof RedeemFromRequestContent>;

const CHAIN_ID = mainnet.id;
const PLASMA_VAULT_ADDRESS = ANVIL_TEST_ACCOUNT[0].address;
const ONE_DAY_IN_SECONDS = 60n * 60n * 24n;
const EIGHT_HOURS_IN_SECONDS = ONE_DAY_IN_SECONDS / 3n;
const FOUR_DAYS_IN_SECONDS = ONE_DAY_IN_SECONDS * 4n;
const ASSET_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // USDC

const ContextDecorator: Decorator = (Story, context) => {
  const txState = useTransactionState();

  return (
    <Providers
      config={{
        chainId: CHAIN_ID,
        fusionVaultAddress: PLASMA_VAULT_ADDRESS,
      }}
    >
      <RedeemFromRequestContext.Provider
        value={{
          actions: {
            executeRedeemFromRequest: () => Promise.resolve(),
          },
          params: context.args as Params,
          txState,
        }}
      >
        <Story />
      </RedeemFromRequestContext.Provider>
    </Providers>
  );
};

export const CanWithdrawMatured: Story = {
  decorators: [ContextDecorator],
  args: {
    chainId: CHAIN_ID,
    plasmaVaultAddress: PLASMA_VAULT_ADDRESS,
    assetDecimals: 6,
    canWithdraw: true,
    requestedAmount: 1000_000000n,
    requestedAssets: 1000_000000n,
    assetAddress: ASSET_ADDRESS,
    underlyingAssetPrice: parseEther('1'),
    showBalanceInDollars: false,
    assetSymbol: 'USDC',
    config: {
      visibleDecimals: {
        myDepositAsset: 2,
        myDepositUsd: 2,
      },
    },
    // 8 hours from now
    endWithdrawWindowTimestamp:
      BigInt(getUnixTime(getNow())) + EIGHT_HOURS_IN_SECONDS,
    withdrawWindowInSeconds: ONE_DAY_IN_SECONDS,
  },
};

/**
 * @dev User cannot withdraw because Alpha didn't invoke releaseFunds
 * on WithdrawManager smart contract
 */
export const NotReady: Story = {
  ...CanWithdrawMatured,
  args: {
    ...CanWithdrawMatured.args,
    canWithdraw: false,
  },
};

/**
 * @dev Nothing is rendered
 */
export const NoRequestedAmount: Story = {
  ...CanWithdrawMatured,
  args: {
    ...CanWithdrawMatured.args,
    requestedAmount: undefined,
  },
};

export const Expired: Story = {
  ...CanWithdrawMatured,
  args: {
    ...CanWithdrawMatured.args,
    // 1 day ago
    endWithdrawWindowTimestamp:
      BigInt(getUnixTime(getNow())) - ONE_DAY_IN_SECONDS,
  },
};

export const WaitingForMaturity: Story = {
  ...CanWithdrawMatured,
  args: {
    ...CanWithdrawMatured.args,
    canWithdraw: false,
    // 4 days from now
    endWithdrawWindowTimestamp:
      BigInt(getUnixTime(getNow())) + FOUR_DAYS_IN_SECONDS,
    withdrawWindowInSeconds: ONE_DAY_IN_SECONDS,
  },
};

/**
 * @dev User should be able to withdraw even if the maturity is not reached
 * canWithdraw takes precedence over maturity
 */
export const CanWithdrawNotMatured: Story = {
  ...CanWithdrawMatured,
  args: {
    ...CanWithdrawMatured.args,
    // 4 days from now
    endWithdrawWindowTimestamp:
      BigInt(getUnixTime(getNow())) + FOUR_DAYS_IN_SECONDS,
    withdrawWindowInSeconds: ONE_DAY_IN_SECONDS,
  },
};
