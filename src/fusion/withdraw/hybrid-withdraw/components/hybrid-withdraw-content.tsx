import { HybridWithdrawForm } from './hybrid-withdraw-form';
import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import { ArrowUpFromLineIcon } from 'lucide-react';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmTransactionDialog } from '@/transactions/components/ConfirmTransactionDialog';
import { ErrorDialog } from '@/errors/components/ErrorDialog';

export const HybridWithdrawContent = () => {
  const {
    state: { txState, dismissError },
  } = useHybridWithdrawContext();
  const { isConfirming, error } = txState;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <ArrowUpFromLineIcon className="w-5 h-5 text-ipor-asset" />
          Withdraw
        </DialogTitle>
        <DialogDescription className="sr-only">
          Withdraw assets from Plasma Vault
        </DialogDescription>
      </DialogHeader>
      <HybridWithdrawForm />
      <ConfirmTransactionDialog isOpen={isConfirming} />
      <ErrorDialog error={error} onDismiss={dismissError} />
    </>
  );
};
