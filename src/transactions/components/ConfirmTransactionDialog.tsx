import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoaderIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
}

export const ConfirmTransactionDialog = ({ isOpen }: Props) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <div className="flex py-8 justify-center">
          <LoaderIcon className="w-10 h-10 animate-spin" />
        </div>
        <DialogHeader className="pr-0 border-none">
          <DialogTitle className="text-center">Confirm in wallet</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
