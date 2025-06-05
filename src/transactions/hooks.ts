import { type TransactionKey } from './types';
import { useTransactions } from './context';

export const useIsTxPending = (txKey: TransactionKey | TransactionKey[]) => {
  const { transactions } = useTransactions();

  const foundTx = transactions.find(({ type, data }) => {
    const exists = Array.isArray(txKey) ? txKey.includes(type) : txKey === type;
    const isPending = data.state === 'pending';

    return exists && isPending;
  });

  return !!foundTx;
};
