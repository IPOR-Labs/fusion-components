import { createContext, type ReactNode, useContext } from 'react';
import { type Actions, useActions } from '@/fusion/deposit/deposit-asset/deposit-asset.actions';
import { type Params, useParams } from '@/fusion/deposit/deposit-asset/deposit-asset.params';
import { type DepositForm, useDepositForm } from '@/fusion/deposit/deposit-asset/deposit-asset.form';
import { type ContextState, useContextState } from '@/fusion/deposit/deposit-asset/deposit-asset.state';

interface ContextData {
  params: Params;
  actions: Actions;
  state: ContextState;
  form: DepositForm;
}

const PlasmaVaultDepositContext = createContext<ContextData | null>(null);

interface Props {
  children: ReactNode;
  onConfirm?: () => void;
}

export const PlasmaVaultDepositProvider = ({ children, onConfirm }: Props) => {
  const params = useParams({ onConfirm });
  const state = useContextState({ params });
  const actions = useActions({ params, state });
  const form = useDepositForm();

  return (
    <PlasmaVaultDepositContext.Provider
      value={{
        actions,
        params,
        state,
        form,
      }}
    >
      {children}
    </PlasmaVaultDepositContext.Provider>
  );
};

export const useDeposit = () => {
  const provideLiquidityData = useContext(PlasmaVaultDepositContext);

  if (!provideLiquidityData) {
    throw new Error(
      'useDeposit must be used inside PlasmaVaultDepositProvider',
    );
  }

  return provideLiquidityData;
};
