import {
  darkTheme,
  RainbowKitProvider,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useState,
} from 'react';
import {
  useAccount,
  useAccountEffect,
  useChainId,
  useSwitchChain,
} from 'wagmi';
import { useIsSafeWallet } from './hooks/useIsSafeWallet';
import { walletConnectedToast, walletDisconnectedToast } from '@/wallet/toasts';
import { useDisconnect } from 'wagmi';
import { isSafeApp } from '@/wallet/utils/isSafeApp';
import { extractChain } from 'viem';
import { chains, type ChainId } from '@/app/wagmi';

const AppRainbowkitProvider = (props: PropsWithChildren) => {
  return (
    <RainbowKitProvider
      theme={darkTheme()}
      modalSize="compact"
      appInfo={{
        appName: 'IPOR Fusion',
      }}
    >
      {props.children}
    </RainbowKitProvider>
  );
};

const WalletContext = createContext<WalletContextData | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <AppRainbowkitProvider>
      <WalletProviderInner>{children}</WalletProviderInner>
    </AppRainbowkitProvider>
  );
};

const WalletProviderInner = ({ children }: WalletProviderProps) => {
  const value = useProvideWallet();

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

const useProvideWallet = () => {
  const { address: accountAddress, connector, isConnected } = useAccount();
  const walletChainId = useChainId();
  const isSafeWallet = useIsSafeWallet();
  const { disconnect } = useDisconnect();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const chain = extractChain({
    chains,
    id: walletChainId,
  });

  useAccountEffect({
    onConnect() {
      walletConnectedToast();
    },
    onDisconnect() {
      walletDisconnectedToast();
    },
  });

  const isSafeWalletInSafeApp = isSafeWallet && isSafeApp;
  const _disconnectWallet = () => {
    disconnect();
    setIsDrawerOpen(false);
  };
  const disconnectWallet = isSafeWalletInSafeApp
    ? undefined
    : _disconnectWallet;

  const walletChainName = walletChainId
    ? chain.name
    : undefined;

  const { openConnectModal } = useConnectModal();

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
    selectWallet: openConnectModal,
    changeChain,
    disconnectWallet,
    isSafeWalletInSafeApp,
    isDrawerOpen,
    setIsDrawerOpen,
  };
};

type WalletContextData = ReturnType<typeof useProvideWallet>;

export const useWallet = () => {
  const wallet = useContext(WalletContext);

  if (!wallet) {
    throw new Error('useWallet must be used inside WalletProvider');
  }

  return wallet;
};
