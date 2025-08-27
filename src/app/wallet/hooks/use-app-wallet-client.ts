import { useConfigContext } from "@/app/config/config.context";
import { useAppChain } from "@/app/config/hooks/use-app-chain";
import { createWalletClient, custom } from "viem";

export const useAppWalletClient = () => {
  const { provider } = useConfigContext();

  const chain = useAppChain();

  if (provider === undefined) return undefined;

  const walletClient = createWalletClient({
    chain,
    transport: custom(provider),
  });
  
  return walletClient;
}