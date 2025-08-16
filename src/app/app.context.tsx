import { createContext, useContext } from 'react';
import type { WalletClient } from 'viem'

export interface AppContextValue {
  /** Optional viem WalletClient for wallet operations */
  walletClient?: WalletClient | undefined
  /** Function to call when wallet connection is requested */
  connect?: () => Promise<void>
  /** Error handler for user-impacting failures */
  onError?: (err: unknown) => void
}

export const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useAppContext must be used inside AppContext.Provider',
    );
  }

  return context;
};
