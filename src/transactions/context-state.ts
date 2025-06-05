import { useState } from 'react';
import {
  transactionToastError,
  transactionToastStart,
  transactionToastSuccess,
} from '@/transactions/toasts';
import { type Transaction, type TransactionData } from '@/transactions/types';
import { type Hash } from 'viem';

export const useTransactionsState = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (tx: Transaction) => {
    transactionToastStart(tx);
    setTransactions((prevTransactions) => {
      return [tx, ...prevTransactions];
    });
  };

  const updateTransaction = (hash: Hash, data: TransactionData) => {
    setTransactions((prevTransactions) => {
      return prevTransactions.map((t) => {
        if (t.hash === hash) {
          const updatedTx = {
            ...t,
            data,
          };

          /**
           * @dev Be careful with this.
           * We do side effects inside state update
           * to have access to current prevTransactions.
           */
          if (data.state === 'success') {
            transactionToastSuccess(updatedTx);
          }
          if (data.state === 'error') {
            transactionToastError(updatedTx);
          }

          return updatedTx;
        }

        return t;
      });
    });
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
  };
};

export type ContextState = ReturnType<typeof useTransactionsState>;
