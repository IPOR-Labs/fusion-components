import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from './wagmi'
import { AppContext, type AppContextValue } from '@/app.context'

export const Providers = (props: {
  children: ReactNode;
  appContext: AppContextValue;
  initialState?: State;
}) => {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <AppContext.Provider value={props.appContext}>
      <WagmiProvider config={config} initialState={props.initialState}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </AppContext.Provider>
  )
}
