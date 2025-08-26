import { useAppContext } from "@/app.context";
import { useQuery } from "@tanstack/react-query";

export const useWalletChainId = () => {
  const { walletClient } = useAppContext();

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