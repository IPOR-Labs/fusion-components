import { useAppWalletClient } from "@/app/wallet/hooks/use-app-wallet-client";
import { useQuery } from "@tanstack/react-query";

export const useWalletChainId = () => {
  const walletClient = useAppWalletClient();

  const { data: chainId } = useQuery({
    queryKey: ['wallet-chain-id'],
    queryFn: async () => {
      if (walletClient === undefined) {
        throw new Error('walletClient is undefined');
      }
      const chainId = await walletClient.getChainId();
      return chainId;
    },
    enabled: walletClient !== undefined,
  });

  return chainId;
};