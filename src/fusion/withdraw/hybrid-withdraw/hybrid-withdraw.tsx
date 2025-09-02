import { HybridWithdrawContext } from './hybrid-withdraw.context';
import { useParams } from './hybrid-withdraw.params';
import { useTransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { useActions } from './hybrid-withdraw.actions';
import { useHybridWithdrawForm } from './hybrid-withdraw.form';
import { HybridWithdrawForm } from './components/hybrid-withdraw-form';

export const HybridWithdraw = () => {
  const params = useParams();
  const txState = useTransactionState();
  const actions = useActions({ params, txState });
  const form = useHybridWithdrawForm();

  return (
    <HybridWithdrawContext.Provider
      value={{
        params,
        actions,
        txState,
        form,
      }}
    >
      <HybridWithdrawForm />
    </HybridWithdrawContext.Provider>
  );
};
