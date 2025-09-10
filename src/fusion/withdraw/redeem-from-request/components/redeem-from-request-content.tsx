import { useRedeemFromRequestContext } from "@/fusion/withdraw/redeem-from-request/redeem-from-request.context";
import { TransactionFeedback } from "@/app/transactions/components/transaction-feedback";
import { useTimer } from "@/fusion/withdraw/redeem-from-request/redeem-from-request.hooks";
import { RedeemFromRequestRequestedAmountBalance } from "@/fusion/withdraw/redeem-from-request/components/redeem-from-request-requested-amount-balance";
import { RedeemFromRequestRequestedAmount } from "@/fusion/withdraw/redeem-from-request/components/redeem-from-request-requested-amount";
import { RedeemFromRequestRedeem } from "@/fusion/withdraw/redeem-from-request/components/redeem-from-request-redeem";

export const RedeemFromRequestContent = () => {
  const {
    params: {
      requestedAssets,
      endWithdrawWindowTimestamp,
      withdrawWindowInSeconds,
    },
    txState,
  } = useRedeemFromRequestContext();
  const { isExpired } = useTimer({
    endWithdrawWindowTimestamp,
    withdrawWindowInSeconds,
  });

  if (requestedAssets === undefined || requestedAssets === 0n) return null;

  if (isExpired) return <Expired />;

  return (
    <>
      <div className="flex gap-4 items-center">
        <RedeemFromRequestRequestedAmount />
        <RedeemFromRequestRedeem />
      </div>
      <TransactionFeedback transactionState={txState} />
    </>
  );
};

const Expired = () => {
  const {
    params: {
      requestedAssets,
      showBalanceInDollars,
      assetDecimals,
      underlyingAssetPrice,
      assetSymbol,
    },
  } = useRedeemFromRequestContext();

  if (
    requestedAssets === undefined ||
    requestedAssets === 0n ||
    !underlyingAssetPrice ||
    !assetDecimals
  ) return null;

  return (
    <div className="flex gap-1 items-baseline text-xs font-regular text-muted-foreground">
      <span>Withdrawal request of </span>
      <RedeemFromRequestRequestedAmountBalance
        showBalanceInDollars={showBalanceInDollars}
        requestedAssets={requestedAssets}
        assetDecimals={assetDecimals}
        underlyingAssetPrice={underlyingAssetPrice}
        className="text-sm"
      />
      <span>{` ${!showBalanceInDollars ? assetSymbol : ''} has expired.`}</span>
    </div>
  );
};
