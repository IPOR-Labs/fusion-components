import { DepositAssetForm } from './deposit-asset-form';
import { useDepositAssetContext } from '../deposit-asset.context';
import { DepositAssetRevokeUsdtAllowance } from './deposit-asset-revoke-usdt-allowance';
import { parseUnits } from 'viem';
import { TransactionFeedback } from '@/app/transactions/components/transaction-feedback';
import { WithdrawNote } from '@/fusion/withdraw/components/withdraw-note';

import styles from './deposit-asset-body.module.css';

export const DepositAssetBody = () => {
  const {
    params: {
      assetDecimals,
      setAllowanceFromEvent,
      isRevokingUsdtAllowance,
      hideRevokingUsdtAllowance,
      assetSymbol,
      isScheduledWithdrawal,
      withdrawWindowInSeconds,
    },
    form,
    approveTxState,
    depositTxState,
  } = useDepositAssetContext();

  const amountString = form.watch('amount');

  const amount = assetDecimals
    ? parseUnits(amountString, assetDecimals)
    : undefined;

  return (
    <div>
      <WithdrawNote
        isScheduledWithdrawal={isScheduledWithdrawal}
        withdrawWindowInSeconds={withdrawWindowInSeconds}
        withdrawTokenSymbol={assetSymbol}
      />
      <DepositAssetForm />
      {isRevokingUsdtAllowance && (
        <DepositAssetRevokeUsdtAllowance
          newUsdtAllowance={amount || 0n}
          onDone={hideRevokingUsdtAllowance}
          onUpdateAllowance={setAllowanceFromEvent}
        />
      )}
      <div className={styles.transactionFeedback}>
        <TransactionFeedback transactionState={approveTxState} />
        <TransactionFeedback transactionState={depositTxState} />
      </div>
    </div>
  );
};
