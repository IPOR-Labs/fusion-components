import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FusionDepositWidget } from '@/widgets/fusion-deposit/fusion-deposit.widget';
import Onboard, { type EIP1193Provider } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets';
import '@/themes/theme-fusion.css';
import '@/index.css';
import { toHex, type Address } from 'viem';
import { arbitrum, base, mainnet } from 'viem/chains';
import type { ChainId } from '@/app/config/wagmi';
import { PlasmaVaultPicker, type PlasmaVaultValue } from '@/fusion/vaults/components/plasma-vault-picker';

const injected = injectedModule()

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: toHex(mainnet.id),
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: import.meta.env.VITE_RPC_URL_MAINNET,
    },
    {
      id: toHex(base.id),
      token: 'ETH',
      label: 'Base',
      rpcUrl: import.meta.env.VITE_BASE_RPC_URL,
    },
    {
      id: toHex(arbitrum.id),
      token: 'ETH',
      label: 'Arbitrum',
      rpcUrl: import.meta.env.VITE_ARBITRUM_RPC_URL,
    }
  ]
});



const AppWrapper = () => {
  const [provider, setProvider] = useState<EIP1193Provider | undefined>(undefined);
  const [plasmaVault, setPlasmaVault] = useState<PlasmaVaultValue | undefined>(undefined);

  return (
    <div className="space-y-10">
      <PlasmaVaultPicker setPlasmaVault={setPlasmaVault} />
      {plasmaVault && (
        <FusionDepositWidget
          fusionVaultAddress={plasmaVault.vaultAddress}
          chainId={plasmaVault.chainId}
          connect={async () => {
            const wallets = await onboard.connectWallet();
            setProvider(wallets[0].provider);
          }}
          // Type EIP1193Provider in viem and @web3-onboard have not compatible types
          // @ts-expect-error
          provider={provider}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
