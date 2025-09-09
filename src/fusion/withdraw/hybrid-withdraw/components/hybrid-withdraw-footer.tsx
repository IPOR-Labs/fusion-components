import {
  useIsSubmitDisabled,
  useSubmitButtonLabel,
} from '../hybrid-withdraw.hooks';
import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import { TransactionFormButtons } from '@/components/transaction-form-buttons';

export const HybridWithdrawFooter = () => {
  const {
    txState,
  } = useHybridWithdrawContext();
  const isSubmitDisabled = useIsSubmitDisabled();
  const submitButtonLabel = useSubmitButtonLabel();
  const isPending = txState.txStatus.type === 'pending';

  return (
    <TransactionFormButtons
      isSubmitDisabled={isSubmitDisabled}
      transactionSubmitButtonText={submitButtonLabel}
      isLoading={isPending}
    />
  );
};
