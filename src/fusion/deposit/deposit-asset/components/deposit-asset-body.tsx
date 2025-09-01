import { DepositAssetForm } from './deposit-asset-form';
import { useDepositAssetContext } from '../deposit-asset.context';
import { TransactionFeedback } from '@/app/transactions/components/transaction-feedback';
import { WithdrawNote } from '@/fusion/withdraw/components/withdraw-note';

export const DepositAssetBody = () => {
  const {
    params: {
      assetSymbol,
      isScheduledWithdrawal,
      withdrawWindowInSeconds,
    },
    approveTxState,
    depositTxState,
  } = useDepositAssetContext();

  return (
    <div>
      <WithdrawNote
        isScheduledWithdrawal={isScheduledWithdrawal}
        withdrawWindowInSeconds={withdrawWindowInSeconds}
        withdrawTokenSymbol={assetSymbol}
      />
      <DepositAssetForm />
      <div className="space-y-2">
        <TransactionFeedback transactionState={approveTxState} />
        <TransactionFeedback transactionState={depositTxState} />
      </div>
    </div>
  );
};
