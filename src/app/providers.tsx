import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from './wagmi'
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { TransactionsProvider } from '@/transactions/context'
import { WalletProvider } from '@/wallet/context'

export const Providers = (props: {
  children: ReactNode
  initialState?: State
}) => {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <WalletProvider>
            <TransactionsProvider>
              {props.children}
            </TransactionsProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
