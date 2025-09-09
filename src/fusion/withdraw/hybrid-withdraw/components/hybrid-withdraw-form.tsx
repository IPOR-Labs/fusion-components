import { Form } from '@/components/ui/form';
import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import { HybridWithdrawFooter } from './hybrid-withdraw-footer';
import { HybridWithdrawAmountInput } from './hybrid-withdraw-amount-input';
import { useSubmit } from '../hybrid-withdraw.hooks';
import { HybridWithdrawDetails } from './hybrid-withdraw-details';
import { TransactionFeedback } from '@/app/transactions/components/transaction-feedback';
import { FunctionPausedBanner } from '@/fusion/prehooks/components/function-paused-banner';

export const HybridWithdrawForm = () => {
  const {
    params: {
      isRedeemPaused,
      isRequestSharesPaused,
      isWithdrawPaused,
    },
    form,
    txState,
  } = useHybridWithdrawContext();
  const submit = useSubmit();

  const isPaused = isRedeemPaused || isRequestSharesPaused || isWithdrawPaused;

  return (
    <div className="space-y-8">
      {isPaused && <FunctionPausedBanner />}
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(submit)}>
          <HybridWithdrawAmountInput />
          <HybridWithdrawDetails />
          <HybridWithdrawFooter />
        </form>
      </Form>
      <TransactionFeedback transactionState={txState} />
    </div>
  );
};
