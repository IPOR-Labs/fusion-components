import { createContext, useContext } from 'react';
import { type Actions } from '@/fusion/withdraw/redeem-from-request/redeem-from-request.actions';
import { type Params } from '@/fusion/withdraw/redeem-from-request/redeem-from-request.params';
import { type TransactionState } from '@/app/transactions/hooks/use-transaction-state';

interface ContextData {
  params: Params;
  actions: Actions;
  txState: TransactionState;
}

export const RedeemFromRequestContext = createContext<ContextData | null>(null);

export const useRedeemFromRequestContext = () => {
  const context = useContext(RedeemFromRequestContext);

  if (!context) {
    throw new Error(
      'useRedeemFromRequestContext must be used inside RedeemFromRequestContext.Provider',
    );
  }

  return context;
};
