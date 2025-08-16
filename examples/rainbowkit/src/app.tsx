import { useEffect, useRef, useState } from 'react';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccountEffect, useWalletClient } from 'wagmi';
import { FusionDepositWebComponent } from '../../../src/widgets/fusion-deposit/fusion-deposit.web-component';

export const App = () => {
  const widgetRef = useRef<FusionDepositWebComponent | null>(null);
  const [lastError, setLastError] = useState<unknown>(null);

  const { data: walletClient } = useWalletClient();
  const { openConnectModal } = useConnectModal();

  useAccountEffect({
    onDisconnect() {
      widgetRef.current?.update({
        walletClient: undefined,
      });
    },
  })

  useEffect(() => {
    widgetRef.current?.update({
      walletClient,
      onError: (e: unknown) => setLastError(e),
      connect: async () => {
        openConnectModal?.();
      },
    });
  }, [widgetRef.current, walletClient]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <ConnectButton />
        <div style={{ color: 'tomato' }}>{lastError ? String(lastError) : null}</div>
      </div>
      {/* @ts-expect-error */}
      <fusion-deposit
        ref={widgetRef}
        data-address="0x45aa96f0b3188d47a1dafdbefce1db6b37f58216"
        data-chain-id="8453"
      />
    </div>
  );
};


