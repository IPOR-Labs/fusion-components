import { useState } from 'react';
import { type TransactionStateHandlers } from '../transactions.types';
import type { Hash, TransactionReceipt } from 'viem';

type TxStatus = {
  type: 'idle';
} | {
  type: 'confirming';
} | {
  type: 'pending';
  hash: Hash;
}  | {
  type: 'success';
  hash: Hash;
  receipt: TransactionReceipt;
}  | {
  type: 'error';
  error: unknown;
  hash: Hash | undefined;
  receipt: TransactionReceipt | undefined;
} 

export const useTransactionState = (props: TransactionStateHandlers = {}) => {
  const [txStatus, setTxStatus] = useState<TxStatus>({
    type: 'idle',
  });

  const transactionStateHandlers: TransactionStateHandlers = {
    onInit: () => {
      setTxStatus({
        type: 'confirming',
      });
      props.onInit?.();
    },
    onConfirm: ({ hash }) => {
      setTxStatus({
        type: 'pending',
        hash,
      });
      props.onConfirm?.({ hash });
    },
    onSuccess: ({ hash, receipt }) => {
      setTxStatus({
        type: 'success',
        hash,
        receipt,
      });
      props.onSuccess?.({ hash, receipt });
    },
    onError: ({ error, hash, receipt }) => {
      setTxStatus({
        type: 'error',
        hash,
        error,
        receipt,
      });
      props.onError?.({ error, hash, receipt });
    },
  };

  const resetTransactionState = () => {
    setTxStatus({
      type: 'idle',
    });
  };

  return {
    txStatus,
    transactionStateHandlers,
    resetTransactionState,
  };
};

export type TransactionState = ReturnType<typeof useTransactionState>;
