import { ConfirmTransactionDialog } from '@/transactions/components/ConfirmTransactionDialog';
import { ErrorDialog } from '@/errors/components/ErrorDialog';
import { Revoke } from './components/Revoke';
import { useRevokeAllowance } from './context';

export const Content = () => {
  const {
    state: { txState, dismissError },
  } = useRevokeAllowance();

  const { error, isConfirmingTransaction } = txState;

  return (
    <>
      <Revoke />
      <ErrorDialog error={error} onDismiss={dismissError} />
      <ConfirmTransactionDialog isOpen={isConfirmingTransaction} />
    </>
  );
};
