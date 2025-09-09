import { useEffect, useRef, useState } from 'react';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useAccountEffect } from 'wagmi';
import { FusionDepositWebComponent } from '../../../src/widgets/fusion-deposit/fusion-deposit.web-component';

export const App = () => {
  const widgetRef = useRef<FusionDepositWebComponent | null>(null);
  const [lastError, setLastError] = useState<unknown>(null);

  const { connector } = useAccount();
  const { openConnectModal } = useConnectModal();

  useAccountEffect({
    onDisconnect() {
      widgetRef.current?.update({
        walletClient: undefined,
      });
    },
  })

  useEffect(() => {
    if (!connector?.getProvider) return;

    (async () => {
      const provider = await connector.getProvider();
      widgetRef.current?.update({
        provider,
        onError: (e: unknown) => setLastError(e),
        connect: async () => {
          openConnectModal?.();
        },
      });
    })();
  }, [widgetRef.current, connector]);

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


