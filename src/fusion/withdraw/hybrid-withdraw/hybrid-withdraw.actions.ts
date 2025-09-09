import { type Params } from './hybrid-withdraw.params';
import { useWithdraw } from '../actions/withdraw.action';
import { useRedeem } from '../actions/redeem.action';
import { useRequestShares } from '../actions/request-shares.action';
import { type TransactionState } from '@/app/transactions/hooks/use-transaction-state';

interface Args {
  params: Params;
  txState: TransactionState;
}

export const useActions = ({
  txState: { transactionStateHandlers },
  params: { withdrawManagerAddress },
}: Args) => {
  const { execute: executeRedeem } = useRedeem({
    transactionStateHandlers,
  });
  const { execute: executeWithdraw } = useWithdraw({
    transactionStateHandlers,
  });
  const { execute: executeRequestShares } = useRequestShares({
    withdrawManagerAddress,
    transactionStateHandlers,
  });

  return {
    executeRedeem,
    executeWithdraw,
    executeRequestShares,
  };
};

export type Actions = ReturnType<typeof useActions>;
