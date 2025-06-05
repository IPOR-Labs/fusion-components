import { type AppError } from '@/errors/types';
import { type Params } from './deposit-asset.params';
import { useState } from 'react';
import { type TransactionStateHandlers } from '@/transactions/types';

interface Args {
  params: Params;
}

export const useContextState = ({ params }: Args) => {
  const [plasmaVaultDepositForm, setplasmaVaultDepositForm] = useState<{
    isConfirmingTransaction: boolean;
    error: AppError | undefined;
  }>({
    isConfirmingTransaction: false,
    error: undefined,
  });
  const [isRevokeModal, setIsRevokeModal] = useState(false);

  const dismissError = () => {
    setplasmaVaultDepositForm({
      ...plasmaVaultDepositForm,
      error: undefined,
    });
  };

  const showRevokeModal = () => {
    setIsRevokeModal(true);
  };

  const hideRevokeModal = () => {
    setIsRevokeModal(false);
  };

  const approveStateHandlers: TransactionStateHandlers = {
    onInit: () => {
      setplasmaVaultDepositForm({
        ...plasmaVaultDepositForm,
        isConfirmingTransaction: true,
      });
    },
    onConfirm: () => {
      setplasmaVaultDepositForm({
        ...plasmaVaultDepositForm,
        isConfirmingTransaction: false,
      });
    },
    onError: (error: AppError) => {
      setplasmaVaultDepositForm({
        ...plasmaVaultDepositForm,
        error,
      });
    },
  };

  const depositStateHandlers: TransactionStateHandlers = {
    onInit: () => {
      setplasmaVaultDepositForm({
        ...plasmaVaultDepositForm,
        isConfirmingTransaction: true,
      });
    },
    onConfirm: () => {
      setplasmaVaultDepositForm({
        ...plasmaVaultDepositForm,
        isConfirmingTransaction: false,
      });
      params.onConfirm?.();
    },
    onError: (error: AppError) => {
      setplasmaVaultDepositForm({
        ...plasmaVaultDepositForm,
        error,
      });
    },
    onSuccess: () => {
      params.onDepositSuccess?.();
    },
  };

  return {
    plasmaVaultDepositForm,
    dismissError,
    showRevokeModal,
    hideRevokeModal,
    isRevokeModal,
    approveStateHandlers,
    depositStateHandlers,
  };
};

export type ContextState = ReturnType<typeof useContextState>;
