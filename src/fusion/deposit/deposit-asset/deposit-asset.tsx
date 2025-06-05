import { PlasmaVaultDepositProvider } from './deposit-asset.context';
import { Content } from './content';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export const DepositDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModal = () => setIsModalOpen(false);
  const { connectModalOpen } = useConnectModal();

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      modal={!connectModalOpen}
    >
      <DialogTrigger asChild>
        <Button variant="default">Deposit</Button>
      </DialogTrigger>
      <DialogContent
        className="theme-fusion"
        onInteractOutside={(e) => {
          /**
           * @dev We don't allow interaction outside the dialog
           * to keep this dialog open when user clicks
           * on the consent modal or wallet connect modal
           */
          e.preventDefault();
        }}
      >
        <PlasmaVaultDepositProvider onConfirm={closeModal}>
          <Content />
        </PlasmaVaultDepositProvider>
      </DialogContent>
    </Dialog>
  );
};
