import { Providers } from '@/app/providers'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const App = () => {
  return (
    <Providers>
      <div className="min-h-svh">
        <div className="flex justify-end p-4">
          <ConnectButton />
        </div>
      </div>
    </Providers>
  )
}
