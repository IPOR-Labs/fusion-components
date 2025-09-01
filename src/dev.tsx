import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FusionDepositWidget } from '@/widgets/fusion-deposit/fusion-deposit.widget';
import Onboard, { type EIP1193Provider } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets';
import '@/themes/theme-fusion.css';
import '@/index.css';
import { toHex } from 'viem';
import { arbitrum, base, mainnet } from 'viem/chains';
import { PlasmaVaultPicker, type PlasmaVaultValue } from '@/fusion/vaults/components/plasma-vault-picker';
import { PLASMA_VAULTS_LIST } from '@/lib/plasma-vaults-list';

const DEFAULT_PLASMA_VAULT: PlasmaVaultValue = PLASMA_VAULTS_LIST.at(0)!;

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
  const [plasmaVault, setPlasmaVault] = useState<PlasmaVaultValue>(DEFAULT_PLASMA_VAULT);

  const handleSetPlasmaVault = (plasmaVault: PlasmaVaultValue) => {
    setPlasmaVault(plasmaVault);
    localStorage.setItem('PLASMA_VAULT', JSON.stringify(plasmaVault));
  }

  useEffect(() => {
    const savedPlasmaVault = localStorage.getItem('PLASMA_VAULT');
    if (savedPlasmaVault) {
      setPlasmaVault(JSON.parse(savedPlasmaVault));
    }
  }, []);

  return (
    <div className="space-y-10">
      <PlasmaVaultPicker
        value={plasmaVault}
        setPlasmaVault={handleSetPlasmaVault}
      />
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
