import { createContext, type ReactNode, useContext } from 'react';
import { type Actions } from './actions';
import { type Params } from './params';
import { type ContextState } from './contextState';

interface ContextData {
  params: Params;
  actions: Actions;
  state: ContextState;
}

const RevokeAllowanceContext = createContext<ContextData | null>(null);

interface Props extends ContextData {
  children: ReactNode;
}

export const RevokeAllowanceProvider = ({ children, ...data }: Props) => {
  return (
    <RevokeAllowanceContext.Provider value={data}>
      {children}
    </RevokeAllowanceContext.Provider>
  );
};

export const useRevokeAllowance = () => {
  const context = useContext(RevokeAllowanceContext);

  if (!context) {
    throw new Error(
      'useRevokeAllowance must be used inside RevokeAllowanceProvider',
    );
  }

  return context;
};
