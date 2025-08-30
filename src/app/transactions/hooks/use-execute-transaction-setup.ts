import type { ChainId } from "@/app/config/wagmi";
import { useIsWrongWalletChain } from "@/app/wallet/hooks";
import { useAppWalletClient } from "@/app/wallet/hooks/use-app-wallet-client";
import { useIsSafeWallet } from "@/app/wallet/hooks/use-is-safe-wallet";
import { useWalletAccountAddress } from "@/app/wallet/hooks/use-wallet-account-address";
import { usePublicClient } from "wagmi";

interface Args {
  chainId: ChainId;
}

export const useExecuteTransactionSetup = ({ chainId }: Args) => {
  const publicClient = usePublicClient({ chainId });
  const walletClient = useAppWalletClient();
  const accountAddress = useWalletAccountAddress();
  const isWrongWalletChain = useIsWrongWalletChain(chainId);
  const isSafeWallet = useIsSafeWallet();

  return {
    publicClient,
    walletClient,
    accountAddress,
    isWrongWalletChain,
    isSafeWallet,
  };
};