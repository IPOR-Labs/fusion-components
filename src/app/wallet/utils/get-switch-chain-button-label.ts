import { chains, type ChainId } from '@/app/config/wagmi';
import { extractChain } from 'viem';

export const getSwitchChainButtonLabel = (chainId: ChainId) => {
  const chain = extractChain({
    chains: chains,
    id: chainId,
  });

  return `Switch to ${chain.name}` as const;
};
