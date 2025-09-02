import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { useApprove } from '@/app/allowance/actions/approve.action';
import { usePlasmaVaultDeposit } from '@/fusion/deposit/actions/deposit.action';

interface Args {
  approveTxState: TransactionState;
  depositTxState: TransactionState;
}

export const useActions = ({
  approveTxState,
  depositTxState
}: Args) => {
  const { execute: executeApprove } = useApprove({
    transactionStateHandlers: approveTxState.transactionStateHandlers,
  });

  const { execute: executeDeposit } = usePlasmaVaultDeposit({
    transactionStateHandlers: depositTxState.transactionStateHandlers,
  });

  return {
    executeApprove,
    executeDeposit,
  };
};

export type Actions = ReturnType<typeof useActions>;
