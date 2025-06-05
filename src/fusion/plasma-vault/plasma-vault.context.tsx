import { createContext, type ReactNode, useContext, useState } from 'react';
import type { Address } from 'viem';
import type { ChainId } from '@/app/wagmi';

interface ContextData {
  params: {
    chainId: ChainId;
    plasmaVaultAddress: Address;
  };
  state: {
    showBalanceInDollars: boolean;
    setShowBalanceInDollars: (showBalanceInDollars: boolean) => void;
  };
}

const PlasmaVaultContext = createContext<ContextData | null>(null);

export const usePlasmaVault = () => {
  const context = useContext(PlasmaVaultContext);

  if (!context) {
    throw new Error('usePlasmaVault must be used inside PlasmaVaultProvider');
  }

  return context;
};

interface Props {
  children: ReactNode;
  chainId: ChainId;
  plasmaVaultAddress: Address;
}

export const PlasmaVaultProvider = ({
  children,
  chainId,
  plasmaVaultAddress,
}: Props) => {
  const [showBalanceInDollars, setShowBalanceInDollars] = useState(false);
  return (
    <PlasmaVaultContext.Provider
      value={{
        params: {
          chainId,
          plasmaVaultAddress,
        },
        state: {
          showBalanceInDollars,
          setShowBalanceInDollars,
        },
      }}
    >
      {children}
    </PlasmaVaultContext.Provider>
  );
};
