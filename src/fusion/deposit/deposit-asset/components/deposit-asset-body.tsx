import { DepositAssetForm } from './deposit-asset-form';
import { ErrorDialog } from '@/errors/components/ErrorDialog';
import { ConfirmTransactionDialog } from '@/transactions/components/ConfirmTransactionDialog';
import { useDepositAssetContext } from '../deposit-asset.context';
import { DepositAssetRevokeUsdtAllowance } from './deposit-asset-revoke-usdt-allowance';
import { parseUnits } from 'viem';

export const DepositAssetBody = () => {
  const {
    params: { assetDecimals, setAllowanceFromEvent },
    state: {
      plasmaVaultDepositForm,
      dismissError,
      isRevokeModal,
      hideRevokeModal,
    },
    form,
  } = useDepositAssetContext();
  const { isConfirmingTransaction, error } = plasmaVaultDepositForm;

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
      <ConfirmTransactionDialog isOpen={isConfirmingTransaction} />
      <ErrorDialog error={error} onDismiss={dismissError} />
    </>
  );
};
