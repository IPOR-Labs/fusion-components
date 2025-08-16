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
      onError: (e) => setLastError(e),
      connect: async () => {
        openConnectModal?.();
      },
    });
    return () => {
      widgetRef.current?.destroy();
    }
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
      />
    </div>
  );
};


