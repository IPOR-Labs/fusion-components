import { useIsWrongWalletChain } from "@/app/wallet/hooks";
import { useAppWalletClient } from "@/app/wallet/hooks/use-app-wallet-client";
import { useIsSafeWallet } from "@/app/wallet/hooks/use-is-safe-wallet";
import { useWalletAccountAddress } from "@/app/wallet/hooks/use-wallet-account-address";
import { useAppPublicClient } from "@/app/wallet/hooks/use-app-public-client";
import { useQueryClient } from "@tanstack/react-query";
import { useWalletSwitchChain } from "@/app/wallet/hooks/use-wallet-switch-chain";

export const useAppSetup = () => {
  const publicClient = useAppPublicClient();
  const walletClient = useAppWalletClient();
  const queryClient = useQueryClient();
  const accountAddress = useWalletAccountAddress();
  const isWrongWalletChain = useIsWrongWalletChain();
  const isSafeWallet = useIsSafeWallet();
  const switchChain = useWalletSwitchChain();

  return {
    publicClient,
    walletClient,
    queryClient,
    accountAddress,
    isWrongWalletChain,
    isSafeWallet,
    switchChain,
  };
};