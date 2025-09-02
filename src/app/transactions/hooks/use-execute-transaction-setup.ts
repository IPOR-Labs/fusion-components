import { useIsWrongWalletChain } from "@/app/wallet/hooks";
import { useAppWalletClient } from "@/app/wallet/hooks/use-app-wallet-client";
import { useIsSafeWallet } from "@/app/wallet/hooks/use-is-safe-wallet";
import { useWalletAccountAddress } from "@/app/wallet/hooks/use-wallet-account-address";
import { useAppPublicClient } from "@/app/wallet/hooks/use-app-public-client";

export const useExecuteTransactionSetup = () => {
  const publicClient = useAppPublicClient();
  const walletClient = useAppWalletClient();
  const accountAddress = useWalletAccountAddress();
  const isWrongWalletChain = useIsWrongWalletChain();
  const isSafeWallet = useIsSafeWallet();

  return {
    publicClient,
    walletClient,
    accountAddress,
    isWrongWalletChain,
    isSafeWallet,
  };
};