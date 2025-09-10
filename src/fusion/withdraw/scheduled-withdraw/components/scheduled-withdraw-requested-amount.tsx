import { useScheduledWithdrawContext } from '@/fusion/withdraw/scheduled-withdraw/scheduled-withdraw.context';
import { type Address } from 'viem';
import { ScheduledWithdrawRequestedAmountBalance } from '@/fusion/withdraw/scheduled-withdraw/components/scheduled-withdraw-requested-amount-balance';

export const ScheduledWithdrawRequestedAmount = () => {
  const {
    params: {
      showBalanceInDollars,
      assetDecimals,
      requestedAssets,
      assetAddress,
      underlyingAssetPrice,
    },
  } = useScheduledWithdrawContext();

  return (
    <RequestedAmountDisplay
      showBalanceInDollars={showBalanceInDollars}
      assetDecimals={assetDecimals}
      requestedAssets={requestedAssets}
      assetAddress={assetAddress}
      underlyingAssetPrice={underlyingAssetPrice}
    />
  );
};

interface Props {
  showBalanceInDollars: boolean;
  assetDecimals: number | undefined;
  requestedAssets: bigint | undefined;
  assetAddress: Address | undefined;
  underlyingAssetPrice: bigint | undefined;
}

const RequestedAmountDisplay = ({
  showBalanceInDollars,
  assetDecimals,
  requestedAssets,
  assetAddress,
  underlyingAssetPrice,
}: Props) => {
  if (
    assetDecimals === undefined ||
    requestedAssets === undefined ||
    underlyingAssetPrice === undefined ||
    assetAddress === undefined
  ) {
    return null;
  }

  return (
    <div className="flex items-baseline gap-2">
      <div className="text-sm font-medium text-muted-foreground">
        Requested:
      </div>
      <ScheduledWithdrawRequestedAmountBalance
        showBalanceInDollars={showBalanceInDollars}
        requestedAssets={requestedAssets}
        assetDecimals={assetDecimals}
        underlyingAssetPrice={underlyingAssetPrice}
        assetAddress={assetAddress}
        className="text-2xl font-bold"
      />
    </div>
  );
};
