import { useDeposit } from '@/fusion/deposit/deposit-asset/deposit-asset.context';
import { DepositBody } from '@/fusion/deposit/deposit-asset/components/DepositBody';
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import { ArrowDownToLineIcon } from 'lucide-react';
import { WithdrawNote } from '@/fusion/withdraw/components/WithdrawNote';

export const Content = () => {
  const {
    params: {
      isScheduledWithdrawal,
      withdrawWindowInSeconds,
      assetSymbol,
    },
  } = useDeposit();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <ArrowDownToLineIcon className="w-5 h-5 text-ipor-asset" />
          Deposit
        </DialogTitle>
        <DialogDescription className="sr-only">
          Deposit assets to the Plasma Vault
        </DialogDescription>
      </DialogHeader>
      <WithdrawNote
        isScheduledWithdrawal={isScheduledWithdrawal}
        withdrawWindowInSeconds={withdrawWindowInSeconds}
        withdrawTokenSymbol={assetSymbol}
      />
      <DepositBody />
    </>
  );
};
