import { useAppContext } from '@/app.context';

export const useIsWrongWalletChain = (chainId: number): boolean => {
  const { walletClient } = useAppContext();

  const walletChainId = walletClient?.chain?.id;
  const accountAddress = walletClient?.account?.address;

  if (!accountAddress) return false;
  if (!walletChainId) return false;

  if (walletChainId === chainId) {
    return false;
  }

  return true;
};
