import { type TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { useRedeemFromRequest } from '@/fusion/withdraw/actions/redeem-from-request.action';

interface Args {
  txState: TransactionState;
}

export const useActions = ({
  txState: { transactionStateHandlers },
}: Args) => {
  const { execute: executeRedeemFromRequest } = useRedeemFromRequest({
    transactionStateHandlers,
  });

  return {
    executeRedeemFromRequest,
  };
};

export type Actions = ReturnType<typeof useActions>;
