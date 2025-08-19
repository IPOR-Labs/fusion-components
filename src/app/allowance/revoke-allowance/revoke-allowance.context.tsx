import { createContext, useContext } from 'react';
import { type Actions } from './revoke-allowance.actions';
import { type Params } from './revoke-allowance.params';
import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';

interface ContextValue {
  params: Params;
  actions: Actions;
  revokeAllowanceTxState: TransactionState;
  reapproveTxState: TransactionState;
}

export const RevokeAllowanceContext = createContext<ContextValue | null>(null);

export const useRevokeAllowanceContext = () => {
  const context = useContext(RevokeAllowanceContext);

  if (!context) {
    throw new Error(
      'useRevokeAllowanceContext must be used inside RevokeAllowanceContext.Provider',
    );
  }

  return context;
};
