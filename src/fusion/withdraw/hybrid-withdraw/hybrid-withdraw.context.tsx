import { createContext, useContext } from 'react';
import { type Actions } from './hybrid-withdraw.actions';
import { type Params } from './hybrid-withdraw.params';
import { type HybridWithdrawForm } from './hybrid-withdraw.form';
import { type TransactionState } from '@/app/transactions/hooks/use-transaction-state';

interface ContextValue {
  params: Params;
  actions: Actions;
  form: HybridWithdrawForm;
  txState: TransactionState;
}

export const HybridWithdrawContext = createContext<ContextValue | null>(null);

export const useHybridWithdrawContext = () => {
  const context = useContext(HybridWithdrawContext);

  if (!context) {
    throw new Error(
      'useHybridWithdrawContext must be used inside HybridWithdrawContext.Provider',
    );
  }

  return context;
};
