import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { usePlasmaVaultApprove } from '@/fusion/deposit/actions/approve';
import { usePlasmaVaultDeposit } from '@/fusion/deposit/actions/deposit';
import { type Params } from '@/fusion/deposit/deposit-asset/deposit-asset.params';

interface Args {
  params: Params;
  approveTxState: TransactionState;
  depositTxState: TransactionState;
}

export const useActions = ({ 
  params, 
  approveTxState,
  depositTxState
}: Args) => {
  const { chainId } = params;

  const { execute: executeApprove } = usePlasmaVaultApprove({
    chainId,
    transactionStateHandlers: approveTxState.transactionStateHandlers,
  });

  const { execute: executeDeposit } = usePlasmaVaultDeposit({
    chainId,
    transactionStateHandlers: depositTxState.transactionStateHandlers,
  });

  return {
    executeApprove,
    executeDeposit,
  };
};

export type Actions = ReturnType<typeof useActions>;
