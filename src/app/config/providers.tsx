import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from './wagmi'
import { ConfigContext, type ConfigContextValue } from '@/app/config/config.context'

export const Providers = (props: {
  children: ReactNode;
  config: ConfigContextValue;
  initialState?: State;
}) => {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ConfigContext.Provider value={props.config}>
      <WagmiProvider config={config} initialState={props.initialState}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </ConfigContext.Provider>
  )
}
