import { HybridWithdrawContext } from './hybrid-withdraw.context';
import { useParams } from './hybrid-withdraw.params';
import { useTransactionState } from '@/transactions/useTransactionState';
import { useActions } from './hybrid-withdraw.actions';
import { useHybridWithdrawForm } from './hybrid-withdraw.form';
import { useHybridWithdrawContext } from './hybrid-withdraw.context';
import { ConfirmTransactionDialog } from '@/transactions/components/ConfirmTransactionDialog';
import { ErrorDialog } from '@/errors/components/ErrorDialog';
import { HybridWithdrawForm } from './components/hybrid-withdraw-form';

export const HybridWithdraw = () => {
  const params = useParams({});
  const state = useTransactionState();
  const actions = useActions({ params, state });
  const form = useHybridWithdrawForm();

  return (
    <HybridWithdrawContext.Provider
      value={{
        params,
        actions,
        state,
        form,
      }}
    >
      <HybridWithdrawContent />
    </HybridWithdrawContext.Provider>
  );
};

const HybridWithdrawContent = () => {
  const {
    state: { txState, dismissError },
  } = useHybridWithdrawContext();
  const { isConfirming, error } = txState;

  return (
    <>
      <HybridWithdrawForm />
      <ConfirmTransactionDialog isOpen={isConfirming} />
      <ErrorDialog error={error} onDismiss={dismissError} />
    </>
  );
};

