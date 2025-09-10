import { createContext, useContext } from 'react';
import { type Actions } from '@/fusion/withdraw/scheduled-withdraw/scheduled-withdraw.actions';
import { type Params } from '@/fusion/withdraw/scheduled-withdraw/scheduled-withdraw.params';
import { type TransactionState } from '@/app/transactions/hooks/use-transaction-state';

interface ContextData {
  params: Params;
  actions: Actions;
  txState: TransactionState;
}

export const ScheduledWithdrawContext = createContext<ContextData | null>(null);

export const useScheduledWithdrawContext = () => {
  const context = useContext(ScheduledWithdrawContext);

  if (!context) {
    throw new Error(
      'useScheduledWithdrawContext must be used inside ScheduledWithdrawContext.Provider',
    );
  }

  return context;
};
