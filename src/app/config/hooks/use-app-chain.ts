import { useAppContext } from "@/app.context";
import { chains } from "@/wagmi";
import { extractChain } from "viem";

export const useAppChain = () => {
  const { chainId } = useAppContext();

  return extractChain({ chains, id: chainId });
}