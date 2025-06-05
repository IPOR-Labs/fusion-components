import { createContext, type ReactNode, useContext } from 'react';
import { type Actions, useActions } from './hybrid-withdraw.actions';
import { type Params, useParams } from './hybrid-withdraw.params';
import {
  useHybridWithdrawForm,
  type HybridWithdrawForm,
} from './hybrid-withdraw.form';
import {
  type TransactionState,
  useTransactionState,
} from '@/transactions/useTransactionState';

interface ContextData {
  params: Params;
  actions: Actions;
  state: TransactionState;
  form: HybridWithdrawForm;
}

const HybridWithdrawContext = createContext<ContextData | null>(null);

interface Props {
  children: ReactNode;
  onConfirm?: () => void;
}

export const HybridWithdrawProvider = ({ children, onConfirm }: Props) => {
  const params = useParams({ onConfirm });
  const state = useTransactionState({ onConfirm });
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
      {children}
    </HybridWithdrawContext.Provider>
  );
};

export const useHybridWithdrawContext = () => {
  const provideLiquidityData = useContext(HybridWithdrawContext);

  if (!provideLiquidityData) {
    throw new Error(
      'useHybridWithdrawContext must be used inside PlasmaVaultWithdrawProvider',
    );
  }

  return provideLiquidityData;
};
