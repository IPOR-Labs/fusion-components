import { useAppContext } from "@/app.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWalletSwitchChain = () => {
  const { walletClient, chainId } = useAppContext();
  const queryClient = useQueryClient();
  
  const { mutate: switchChain } = useMutation({
    mutationFn: async () => {
      if (walletClient === undefined) {
        throw new Error('walletClient is undefined');
      }
      await walletClient.switchChain({
        id: chainId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-chain-id'] });
    },
  });

  return switchChain;
};