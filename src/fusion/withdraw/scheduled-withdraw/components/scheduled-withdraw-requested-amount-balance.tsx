import { FullNumber } from '@/components/full-number';
import { TokenIcon } from '@/components/token-icon';
import { DEFAULT_DECIMALS, ONE_ETHER } from '@/lib/constants';
import { formatSignificant } from '@/lib/format-significant';
import { to18 } from '@/lib/to18';
import { type Address } from 'viem';

interface Props {
  showBalanceInDollars: boolean;
  requestedAssets: bigint;
  assetDecimals: number;
  underlyingAssetPrice: bigint;
  assetAddress?: Address;
  className?: string;
}

export const ScheduledWithdrawRequestedAmountBalance = ({
  showBalanceInDollars,
  requestedAssets,
  assetDecimals,
  underlyingAssetPrice,
  assetAddress,
  className,
}: Props) => {
  const requestedAssets_18 = to18(requestedAssets, assetDecimals);
  const requestedAssetsUsd_18 =
    (requestedAssets_18 * underlyingAssetPrice) / ONE_ETHER;

  if (showBalanceInDollars) {
    return (
      <FullNumber value={requestedAssetsUsd_18} className={className}>
        $
        {formatSignificant(
          requestedAssetsUsd_18,
          DEFAULT_DECIMALS,
        )}
      </FullNumber>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <FullNumber value={requestedAssets} className={className}>
        {formatSignificant(
          requestedAssets,
          assetDecimals,
        )}
      </FullNumber>
      {assetAddress && (
        <TokenIcon
          address={assetAddress}
          className="w-6 h-6"
        />
      )}
    </div>
  );
};
