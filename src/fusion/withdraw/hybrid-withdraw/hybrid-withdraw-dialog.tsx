import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAccountBalanceInPlasmaVault } from '@/fusion/plasma-vault/hooks/useAccountBalanceInPlasmaVault';
import { useState } from 'react';
import { HybridWithdrawProvider } from './hybrid-withdraw.context';
import { HybridWithdrawContent } from './components/hybrid-withdraw-content';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export const HybridWithdrawDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModal = () => setIsModalOpen(false);

  const balanceToWithdraw = useAccountBalanceInPlasmaVault();
  const withdrawButtonDisabled =
    balanceToWithdraw === undefined || balanceToWithdraw <= 0n;
  const { connectModalOpen } = useConnectModal();

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      modal={!connectModalOpen}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={withdrawButtonDisabled}>
          Withdraw
        </Button>
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
        <HybridWithdrawProvider onConfirm={closeModal}>
          <HybridWithdrawContent />
        </HybridWithdrawProvider>
      </DialogContent>
    </Dialog>
  );
};
