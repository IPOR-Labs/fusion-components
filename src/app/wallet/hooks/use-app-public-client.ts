import { useConfigContext } from "@/app/config/config.context";
import { usePublicClient } from "wagmi";

export const useAppPublicClient = () => {
  const { chainId } = useConfigContext();
  const publicClient = usePublicClient({ chainId });
  return publicClient;
}