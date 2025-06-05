import { toast } from 'sonner';
import { CircleCheckIcon, UnplugIcon } from 'lucide-react';

const TOAST_ID = 'WALLET';

export const walletConnectedToast = () => {
  toast.success('Wallet connected', {
    icon: <CircleCheckIcon />,
    id: TOAST_ID,
  });
};

export const walletDisconnectedToast = () => {
  toast.info('Wallet disconnected', {
    icon: <UnplugIcon />,
    id: TOAST_ID,
  });
};
