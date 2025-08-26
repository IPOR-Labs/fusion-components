import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';
import { useWalletChainId } from '@/app/wallet/hooks/use-wallet-chain-id';

export const useIsWrongWalletChain = (chainId: number): boolean => {
  const walletChainId = useWalletChainId();
  const accountAddress = useWalletAccountAddress();

  if (!accountAddress) return false;
  if (!walletChainId) return false;

  if (walletChainId === chainId) {
    return false;
  }

  return true;
};
