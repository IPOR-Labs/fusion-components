import type { ChainId } from '@/wagmi';
import { createContext, useContext } from 'react';
import type { Address, WalletClient } from 'viem';

export interface AppConfig {
  /** Optional viem WalletClient for wallet operations */
  walletClient?: WalletClient | undefined
  /** Function to call when wallet connection is requested */
  connect?: () => Promise<void>
  /** Error handler for user-impacting failures */
  onError?: (err: unknown) => void
}

export interface AppContextValue extends AppConfig {
  chainId: ChainId;
  fusionVaultAddress: Address;
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
