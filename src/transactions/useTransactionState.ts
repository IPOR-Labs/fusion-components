import { useState } from 'react';
import { type TransactionStateHandlers } from '@/transactions/types';
import { type AppError } from '@/errors/types';

export const useTransactionState = (props: TransactionStateHandlers = {}) => {
  const [txState, setTxState] = useState<{
    isConfirming: boolean;
    isPending: boolean;
    error: AppError | undefined;
  }>({
    isConfirming: false,
    isPending: false,
    error: undefined,
  });

  const transactionStateHandlers: TransactionStateHandlers = {
    onInit: () => {
      setTxState({
        ...txState,
        isConfirming: true,
      });
      props.onInit?.();
    },
    onConfirm: () => {
      setTxState({
        ...txState,
        isConfirming: false,
        isPending: true,
      });
      props.onConfirm?.();
    },
    onSuccess: () => {
      setTxState({
        ...txState,
        isPending: false,
      });
      props.onSuccess?.();
    },
    onError: (error: AppError) => {
      setTxState({
        ...txState,
        error,
      });
      props.onError?.(error);
    },
  };

  const dismissError = () => {
    setTxState({
      ...txState,
      error: undefined,
    });
  };

  return {
    txState,
    transactionStateHandlers,
    dismissError,
  };
};

export type TransactionState = ReturnType<typeof useTransactionState>;
