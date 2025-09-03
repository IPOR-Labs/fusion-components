import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FusionDepositWidget } from '@/widgets/fusion-deposit/fusion-deposit.widget';
import Onboard, { type EIP1193Provider } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets';
import '@/index.css';
import { toHex } from 'viem';
import { arbitrum, base, mainnet } from 'viem/chains';
import { PlasmaVaultPicker, type PlasmaVaultValue } from '@/fusion/vaults/components/plasma-vault-picker';
import { PLASMA_VAULTS_LIST } from '@/lib/plasma-vaults-list';
import { ThemePicker } from '@/components/theme-picker';

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
  const [theme, setTheme] = useState<string>(localStorage.getItem('THEME') || 'theme-default');

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

  useEffect(() => {
    const id = 'app-theme-stylesheet';
    const existing = document.getElementById(id) as HTMLLinkElement | null;
    const href = `/src/themes/${theme}.css`;
    if (existing) {
      existing.href = href;
    } else {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }, [theme]);

  return (
    <div className="space-y-10">
      <div className="space-y-4 grid grid-cols-2 gap-4">
        <PlasmaVaultPicker
          value={plasmaVault}
          setPlasmaVault={handleSetPlasmaVault}
        />
        <ThemePicker
          value={theme}
          onChange={(value) => {
            setTheme(value);
            localStorage.setItem('THEME', value);
          }}
        />
      </div>
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
