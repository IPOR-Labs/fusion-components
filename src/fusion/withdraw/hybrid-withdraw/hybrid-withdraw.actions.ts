import { type Params } from './hybrid-withdraw.params';
import { useWithdraw } from '../actions/withdraw.action';
import { useMaxRedeem } from '../actions/max-redeem.action';
import { useRequestShares } from '../actions/request-shares.action';
import { useRequestMaxShares } from '../actions/request-max-shares.action';
import { type TransactionState } from '@/app/transactions/hooks/use-transaction-state';

interface Args {
  params: Params;
  txState: TransactionState;
}

export const useActions = ({
  txState: { transactionStateHandlers },
  params: { chainId, fusionVaultAddress, withdrawManagerAddress },
}: Args) => {
  const { execute: executeMaxRedeem } = useMaxRedeem({
    chainId,
    fusionVaultAddress,
    transactionStateHandlers,
  });
  const { execute: executeWithdraw } = useWithdraw({
    chainId,
    fusionVaultAddress,
    transactionStateHandlers,
  });
  const { execute: executeRequestShares } = useRequestShares({
    chainId,
    withdrawManagerAddress,
    transactionStateHandlers,
  });
  const { execute: executeRequestMaxShares } = useRequestMaxShares({
    chainId,
    withdrawManagerAddress,
    transactionStateHandlers,
  });

  return {
    executeWithdraw,
    executeRequestShares,
    executeRequestMaxShares,
    executeMaxRedeem,
  };
};

export type Actions = ReturnType<typeof useActions>;
