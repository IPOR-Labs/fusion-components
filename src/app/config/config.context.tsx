import type { ChainId } from '@/app/config/wagmi';
import { createContext, useContext } from 'react';
import type { Address, EIP1193Provider } from 'viem';

export interface AppConfig {
  /** Optional EIP1193Provider for wallet operations */
  provider?: EIP1193Provider | undefined
  /** Function to call when wallet connection is requested */
  connect?: () => Promise<void>
  /** Error handler for user-impacting failures */
  onError?: (err: unknown) => void
}

export interface ConfigContextValue extends AppConfig {
  chainId: ChainId;
  fusionVaultAddress: Address;
}

export const ConfigContext = createContext<ConfigContextValue | null>(null);

export const useConfigContext = () => {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error(
      'useConfigContext must be used inside ConfigContext.Provider',
    );
  }

  return context;
};
