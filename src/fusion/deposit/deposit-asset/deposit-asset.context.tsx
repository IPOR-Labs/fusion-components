import { createContext, useContext } from 'react';
import { type Actions } from './deposit-asset.actions';
import { type Params } from './deposit-asset.params';
import { type DepositForm } from './deposit-asset.form';
import { type ContextState } from './deposit-asset.state';

interface ContextData {
  params: Params;
  actions: Actions;
  state: ContextState;
  form: DepositForm;
}

export const DepositAssetContext = createContext<ContextData | null>(null);

export const useDepositAssetContext = () => {
  const context = useContext(DepositAssetContext);

  if (!context) {
    throw new Error(
      'useDepositAssetContext must be used inside DepositAssetContext.Provider',
    );
  }

  return context;
};
