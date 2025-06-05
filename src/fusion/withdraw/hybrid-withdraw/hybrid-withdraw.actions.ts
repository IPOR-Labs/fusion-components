import { type Params } from './hybrid-withdraw.params';
import { usePlasmaVaultWithdraw } from '../actions/withdraw.action';
import { usePlasmaVaultMaxRedeem } from '../actions/max-redeem.action';
import { useWithdrawManagerRequestShares } from '../actions/request-shares.action';
import { useWithdrawManagerRequestMaxShares } from '../actions/request-max-shares.action';
import { type TransactionState } from '@/transactions/useTransactionState';

interface Args {
  params: Params;
  state: TransactionState;
}

export const useActions = ({
  state: { transactionStateHandlers },
  params: { chainId, plasmaVaultAddress, withdrawManagerAddress },
}: Args) => {
  const { execute: maxRedeem } = usePlasmaVaultMaxRedeem({
    chainId,
    plasmaVaultAddress,
    transactionStateHandlers,
  });
  const { execute: withdraw } = usePlasmaVaultWithdraw({
    chainId,
    plasmaVaultAddress,
    transactionStateHandlers,
  });
  const { execute: requestShares } = useWithdrawManagerRequestShares({
    chainId,
    withdrawManagerAddress,
    transactionStateHandlers,
  });
  const { execute: requestMaxShares } = useWithdrawManagerRequestMaxShares({
    chainId,
    withdrawManagerAddress,
    transactionStateHandlers,
  });

  return {
    withdraw,
    requestShares,
    requestMaxShares,
    maxRedeem,
  };
};

export type Actions = ReturnType<typeof useActions>;
