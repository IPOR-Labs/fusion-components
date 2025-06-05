import { createContext, type PropsWithChildren, useContext } from 'react';
import { useTransactionsState, type ContextState } from '@/transactions/context-state';

const TransactionsContext = createContext<ContextState | null>(null);

export const TransactionsProvider = (props: PropsWithChildren) => {
  const state = useTransactionsState();

  return (
    <TransactionsContext.Provider value={state}>
      {props.children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const transactionsContextData = useContext(TransactionsContext);

  if (!transactionsContextData) {
    throw new Error('useTransactions must be used inside TransactionsProvider');
  }

  return transactionsContextData;
};
