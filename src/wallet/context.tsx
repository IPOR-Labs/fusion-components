import {
  createContext,
  type ReactNode,
  useContext,
} from 'react';
import {
  useAccount,
  useChainId,
  useSwitchChain,
} from 'wagmi';
import { useIsSafeWallet } from './hooks/useIsSafeWallet';
import { isSafeApp } from '@/wallet/utils/isSafeApp';
import { extractChain } from 'viem';
import { chains, type ChainId } from '@/app/wagmi';
import { useAppContext } from '@/app/app.context';

const WalletContext = createContext<WalletContextData | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const value = useProvideWallet();

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

const useProvideWallet = () => {
  const { address: accountAddress, connector, isConnected } = useAccount();
  const walletChainId = useChainId();
  const isSafeWallet = useIsSafeWallet();
  const { connect } = useAppContext();
  const chain = extractChain({
    chains,
    id: walletChainId,
  });

  const isSafeWalletInSafeApp = isSafeWallet && isSafeApp;

  const walletChainName = walletChainId
    ? chain.name
    : undefined;

  const { switchChain } = useSwitchChain();
  const changeChain = (chainId: ChainId) => {
    return switchChain({ chainId });
  };

  const walletName = (() => {
    if (connector?.name === 'WalletConnect' && isSafeWallet) {
      return 'Safe';
    }

    return connector?.name;
  })();

  const blockExplorerUrl = walletChainId
    ? chain.blockExplorers?.default.url
    : undefined;

  return {
    walletName,
    walletChainName,
    walletChainId,
    accountAddress,
    isConnected,
    blockExplorerUrl,
    selectWallet: connect,
    changeChain,
    isSafeWalletInSafeApp,
  };
};

type WalletContextData = ReturnType<typeof useProvideWallet>;

export const useWalletContext = () => {
  const wallet = useContext(WalletContext);

  if (!wallet) {
    throw new Error('useWallet must be used inside WalletProvider');
  }

  return wallet;
};
