import { chains, type ChainId } from "@/app/config/wagmi";
import { extractChain } from "viem";
import { arbitrum } from "viem/chains";

export const getChainKey = (chainId: ChainId) => {
  if (chainId === arbitrum.id) return 'arbitrum';

  const chain = extractChain({
    chains,
    id: chainId,
  })

  return chain.name.toLowerCase();
}