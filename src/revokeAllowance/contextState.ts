import { type AppError } from '@/errors/types';
import { useState } from 'react';
import { type Params } from './params';
import { type TransactionStateHandlers } from '@/transactions/types';

interface Args {
  params: Params;
}

export const useContextState = ({ params }: Args) => {
  const [txState, setTxState] = useState<{
    error: AppError | undefined;
    isConfirmingTransaction: boolean;
  }>({
    error: undefined,
    isConfirmingTransaction: false,
  });

  const revokeTransactionStateHandlers: TransactionStateHandlers = {
    onInit: () => {
      setTxState({
        ...txState,
        isConfirmingTransaction: true,
      });
    },
    onConfirm: () => {
      setTxState({
        ...txState,
        isConfirmingTransaction: false,
      });
    },
    onError: (error: AppError) => {
      setTxState({
        ...txState,
        error,
      });
    },
  };

  const reapproveTransactionStateHandlers: TransactionStateHandlers = {
    onInit: () => {
      setTxState({
        ...txState,
        isConfirmingTransaction: true,
      });
    },
    onConfirm: () => {
      setTxState({
        ...txState,
        isConfirmingTransaction: false,
      });
      params.onDone();
    },
    onError: (error: AppError) => {
      setTxState({
        ...txState,
        error,
      });
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
    revokeTransactionStateHandlers,
    reapproveTransactionStateHandlers,
    dismissError,
  };
};

export type ContextState = ReturnType<typeof useContextState>;
