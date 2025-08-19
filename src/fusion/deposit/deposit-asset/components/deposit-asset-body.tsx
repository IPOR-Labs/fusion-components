import { DepositAssetForm } from './deposit-asset-form';
import { useDepositAssetContext } from '../deposit-asset.context';
import { DepositAssetRevokeUsdtAllowance } from './deposit-asset-revoke-usdt-allowance';
import { parseUnits } from 'viem';
import { TransactionFeedback } from '@/app/transactions/components/transaction-feedback';

export const DepositAssetBody = () => {
  const {
    params: { assetDecimals, setAllowanceFromEvent, isRevokingUsdtAllowance, hideRevokingUsdtAllowance },
    form,
    approveTxState,
    depositTxState,
  } = useDepositAssetContext();

  const amountString = form.watch('amount');

  const amount = assetDecimals
    ? parseUnits(amountString, assetDecimals)
    : undefined;

  return (
    <>
      <DepositAssetForm />
      {isRevokingUsdtAllowance && (
        <DepositAssetRevokeUsdtAllowance
          newUsdtAllowance={amount || 0n}
          onDone={hideRevokingUsdtAllowance}
          onUpdateAllowance={setAllowanceFromEvent}
        />
      )}
      <TransactionFeedback transactionState={approveTxState} />
      <TransactionFeedback transactionState={depositTxState} />
    </>
  );
};
