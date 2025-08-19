import { DepositAssetForm } from './deposit-asset-form';
import { useDepositAssetContext } from '../deposit-asset.context';
import { DepositAssetRevokeUsdtAllowance } from './deposit-asset-revoke-usdt-allowance';
import { parseUnits } from 'viem';
import { TransactionFeedback } from '@/app/transactions/components/transaction-feedback';

export const DepositAssetBody = () => {
  const {
    params: { assetDecimals, setAllowanceFromEvent, isRevokeModal, hideRevokeModal },
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
      <DepositAssetRevokeUsdtAllowance
        isOpen={isRevokeModal}
        newUsdtAllowance={amount || 0n}
        onDone={hideRevokeModal}
        onUpdateAllowance={setAllowanceFromEvent}
      />
      <TransactionFeedback transactionState={approveTxState} />
      <TransactionFeedback transactionState={depositTxState} />
    </>
  );
};
