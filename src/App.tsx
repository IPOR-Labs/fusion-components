import { Providers } from '@/app/providers'
import { DepositDialog } from '@/fusion/deposit/deposit-asset/deposit-asset'
import { PlasmaVaultProvider } from '@/fusion/plasma-vault/plasma-vault.context'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const App = () => {
  return (
    <Providers>
      <div className="min-h-svh">
        <div className="flex justify-end p-4">
          <ConnectButton />
        </div>
        <PlasmaVaultProvider chainId={1} plasmaVaultAddress="0xe9385eff3f937fcb0f0085da9a3f53d6c2b4fb5f">
          <DepositDialog />
        </PlasmaVaultProvider>
      </div>
    </Providers>
  )
}
