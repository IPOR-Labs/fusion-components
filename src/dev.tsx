import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FusionDepositWidget } from '@/widgets/fusion-deposit/fusion-deposit.widget';
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import '@/index.css';
import { createWalletClient, custom, toHex, type WalletClient } from 'viem';
import { arbitrum, base, mainnet } from 'viem/chains';

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
})

const AppWrapper = () => {
  const [walletClient, setWalletClient] = useState<WalletClient | undefined>(undefined);

  return (
    <FusionDepositWidget
      fusionVaultAddress="0x0d877dc7c8fa3ad980dfdb18b48ec9f8768359c4"
      chainId={base.id}
      connect={async () => {
        const wallets = await onboard.connectWallet();
        const walletClient = createWalletClient({
          chain: base,
          transport: custom(wallets[0].provider),
        });
        setWalletClient(walletClient);
      }}
      walletClient={walletClient}
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);


