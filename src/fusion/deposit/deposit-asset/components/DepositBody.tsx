import { DepositForm } from './DepositForm';
import { ErrorDialog } from '@/errors/components/ErrorDialog';
import { ConfirmTransactionDialog } from '@/transactions/components/ConfirmTransactionDialog';
import { RevokeUsdtAllowance } from '@/fusion/deposit/deposit-asset/components/RevokeUsdtAllowance';
import { useDeposit } from '@/fusion/deposit/deposit-asset/deposit-asset.context';
import { parseUnits } from 'viem';

export const DepositBody = () => {
  const {
    params: { assetDecimals, setAllowanceFromEvent },
    state: {
      plasmaVaultDepositForm,
      dismissError,
      isRevokeModal,
      hideRevokeModal,
    },
    form,
  } = useDeposit();
  const { isConfirmingTransaction, error } = plasmaVaultDepositForm;

  const amountString = form.watch('amount');

  const amount = assetDecimals
    ? parseUnits(amountString, assetDecimals)
    : undefined;

  return (
    <>
      <DepositForm />
      <RevokeUsdtAllowance
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
