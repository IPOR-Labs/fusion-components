import { createContext, useContext } from 'react';
import { type Actions } from './hybrid-withdraw.actions';
import { type Params } from './hybrid-withdraw.params';
import { type HybridWithdrawForm } from './hybrid-withdraw.form';
import { type TransactionState } from '@/transactions/useTransactionState';

interface ContextData {
  params: Params;
  actions: Actions;
  state: TransactionState;
  form: HybridWithdrawForm;
}

export const HybridWithdrawContext = createContext<ContextData | null>(null);

export const useHybridWithdrawContext = () => {
  const context = useContext(HybridWithdrawContext);

  if (!context) {
    throw new Error(
      'useHybridWithdrawContext must be used inside PlasmaVaultWithdrawProvider',
    );
  }

  return context;
};
