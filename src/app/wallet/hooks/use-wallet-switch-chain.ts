import { useConfigContext } from "@/app/config/config.context";
import { useAppWalletClient } from "@/app/wallet/hooks/use-app-wallet-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWalletSwitchChain = () => {
  const { chainId } = useConfigContext();
  const walletClient = useAppWalletClient();
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