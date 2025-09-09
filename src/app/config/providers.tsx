import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { type ReactNode, useEffect, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from './wagmi'
import { ConfigProvider, useConfigContext, type ConfigContextValue } from '@/app/config/config.context'

export const Providers = ({
  children,
  config,
  initialState,
}: {
  children: ReactNode;
  config: ConfigContextValue;
  initialState?: State;
}) => {
  const [wagmiConfig] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ConfigProvider config={config}>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <Refresher>
            {children}
          </Refresher>
        </QueryClientProvider>
      </WagmiProvider>
    </ConfigProvider>
  )
}

const Refresher = ({ children }: { children: ReactNode }) => {
  const { provider } = useConfigContext();
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries();
  };

  useEffect(() => {
    refresh();

    if (!provider) return;

    provider.on('accountsChanged', refresh);
    provider.on('chainChanged', refresh);
    provider.on('disconnect', refresh);
    provider.on('connect', refresh);

    return () => {
      provider.removeListener('accountsChanged', refresh);
      provider.removeListener('chainChanged', refresh);
      provider.removeListener('disconnect', refresh);
      provider.removeListener('connect', refresh);
    }
  }, [provider]);

  return children;
}
