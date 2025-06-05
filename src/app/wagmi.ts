import { arbitrum, base, mainnet } from 'viem/chains';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { injected } from 'wagmi/connectors';

export const chains = [mainnet, arbitrum, base] as const;

export type ChainId = typeof chains[number]['id'];

export function getConfig() {
  return createConfig({
    chains,
    connectors: [
      injected(),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: false,
    transports: {
      [mainnet.id]: http(),
      [arbitrum.id]: http(),
      [base.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
