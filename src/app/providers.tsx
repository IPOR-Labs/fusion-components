import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from './wagmi'
import { TransactionsProvider } from '@/transactions/context'
import { WalletProvider } from '@/wallet/context'
import { AppContext, type AppContextValue } from '@/app/app.context'

export const Providers = (props: {
  children: ReactNode;
  appConfig: AppContextValue;
  initialState?: State;
}) => {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <AppContext.Provider value={props.appConfig}>
      <WagmiProvider config={config} initialState={props.initialState}>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            <TransactionsProvider>
              {props.children}
            </TransactionsProvider>
          </WalletProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AppContext.Provider>
  )
}
