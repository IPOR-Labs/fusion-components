import { arbitrum, base, mainnet } from 'viem/chains';
import { http, createConfig } from 'wagmi'

export const chains = [mainnet, arbitrum, base] as const;

export type ChainId = typeof chains[number]['id'];

export function getConfig() {
  return createConfig({
    chains,
    connectors: [],
    transports: {
      [mainnet.id]: http(import.meta.env.VITE_RPC_URL_MAINNET),
      [arbitrum.id]: http(import.meta.env.VITE_RPC_URL_ARBITRUM),
      [base.id]: http(import.meta.env.VITE_RPC_URL_BASE),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
