import { useWallet } from './context';

export const useIsWrongWalletChain = (chainId: number): boolean => {
  const { accountAddress, walletChainId } = useWallet();

  if (!accountAddress || !walletChainId) {
    return false;
  }

  if (walletChainId === chainId) {
    return false;
  }

  return true;
};

export const useWalletChainAddress = (chainId: number) => {
  const { accountAddress, walletChainId } = useWallet();

  if (!accountAddress || !walletChainId) {
    return undefined;
  }

  if (walletChainId === chainId) {
    return accountAddress;
  }

  return undefined;
};
