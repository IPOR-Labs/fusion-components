import { Providers } from '@/app/providers'
import { DepositDialog } from '@/fusion/deposit/deposit-asset/deposit-asset'
import { PlasmaVaultProvider } from '@/fusion/plasma-vault/plasma-vault.context'
import { HybridWithdrawDialog } from '@/fusion/withdraw/hybrid-withdraw/hybrid-withdraw-dialog'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { base } from 'viem/chains'

export const App = () => {
  return (
    <Providers>
      <div className="min-h-svh">
        <div className="flex justify-end p-4">
          <ConnectButton />
        </div>
        <PlasmaVaultProvider
          chainId={base.id} 
          plasmaVaultAddress="0x18d7fe241df221db1e240051b69fc5dbafae6c90"
        >
          <DepositDialog />
          <HybridWithdrawDialog />
        </PlasmaVaultProvider>
      </div>
    </Providers>
  )
}
