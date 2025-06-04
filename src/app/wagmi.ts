import { arbitrum, base, mainnet } from 'viem/chains';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { injected } from 'wagmi/connectors';

export function getConfig() {
  return createConfig({
    chains: [mainnet, arbitrum, base],
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
