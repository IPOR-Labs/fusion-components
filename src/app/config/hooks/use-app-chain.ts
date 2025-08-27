import { useConfigContext } from "@/app/config/config.context";
import { chains } from "@/app/config/wagmi";
import { extractChain } from "viem";

export const useAppChain = () => {
  const { chainId } = useConfigContext();

  return extractChain({ chains, id: chainId });
}