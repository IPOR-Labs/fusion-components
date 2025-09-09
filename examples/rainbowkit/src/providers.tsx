import { type PropsWithChildren } from 'react';
import { http, WagmiProvider } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { base } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Fusion Demo',
  projectId: 'demo',
  chains: [base],
  ssr: false,
  transports: {
    [base.id]: http(),
  },
});

export const queryClient = new QueryClient();

export const Providers = (props: PropsWithChildren) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={darkTheme()}>
        {props.children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);


