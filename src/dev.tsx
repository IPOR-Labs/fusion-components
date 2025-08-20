import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FusionDepositWidget } from '@/widgets/fusion-deposit/fusion-deposit.widget';
import '@/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FusionDepositWidget
      fusionVaultAddress="0xc4c00d8b323f37527eeda27c87412378be9f68ec"
      chainId={8453}
    />
  </StrictMode>
);


