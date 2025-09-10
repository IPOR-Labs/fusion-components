import { useScheduledWithdrawContext } from "@/fusion/withdraw/scheduled-withdraw/scheduled-withdraw.context";
import { TransactionFeedback } from "@/app/transactions/components/transaction-feedback";
import { useTimer } from "@/fusion/withdraw/scheduled-withdraw/scheduled-withdraw.hooks";
import { ScheduledWithdrawRequestedAmountBalance } from "@/fusion/withdraw/scheduled-withdraw/components/scheduled-withdraw-requested-amount-balance";
import { ScheduledWithdrawRequestedAmount } from "@/fusion/withdraw/scheduled-withdraw/components/scheduled-withdraw-requested-amount";
import { ScheduledWithdrawRedeem } from "@/fusion/withdraw/scheduled-withdraw/components/scheduled-withdraw-redeem";

export const ScheduledWithdrawContent = () => {
  const {
    params: {
      requestedAssets,
      endWithdrawWindowTimestamp,
      withdrawWindowInSeconds,
    },
    txState,
  } = useScheduledWithdrawContext();
  const { isExpired } = useTimer({
    endWithdrawWindowTimestamp,
    withdrawWindowInSeconds,
  });

  if (requestedAssets === undefined || requestedAssets === 0n) return null;

  if (isExpired) return <Expired />;

  return (
    <>
      <div className="flex gap-4 items-center">
        <ScheduledWithdrawRequestedAmount />
        <ScheduledWithdrawRedeem />
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
  } = useScheduledWithdrawContext();

  if (
    requestedAssets === undefined ||
    requestedAssets === 0n ||
    !underlyingAssetPrice ||
    !assetDecimals
  ) return null;

  return (
    <div className="flex gap-1 items-baseline text-xs font-regular text-muted-foreground">
      <span>Withdrawal request of </span>
      <ScheduledWithdrawRequestedAmountBalance
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
