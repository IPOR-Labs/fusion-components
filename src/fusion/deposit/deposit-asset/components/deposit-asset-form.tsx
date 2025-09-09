import { useDepositAssetContext } from '../deposit-asset.context';
import { TransactionFeedback } from '@/app/transactions/components/transaction-feedback';
import { WithdrawNote } from '@/fusion/withdraw/components/withdraw-note';
import { FunctionPausedBanner } from '@/fusion/prehooks/components/function-paused-banner';
import { Form } from '@/components/ui/form';
import { DepositAssetFooter } from './deposit-asset-footer';
import { DepositAssetAmountInput } from './deposit-asset-amount-input';
import { useSubmit } from '../deposit-asset.hooks';
import { LearnAboutFees } from '@/fusion/deposit/deposit-asset/components/learn-about-fees';

export const DepositAssetForm = () => {
  const {
    params: {
      assetSymbol,
      isScheduledWithdrawal,
      withdrawWindowInSeconds,
      isDepositPaused,
    },
    approveTxState,
    depositTxState,
    form,
  } = useDepositAssetContext();

  const submit = useSubmit();

  return (
    <div className="space-y-4">
      {isDepositPaused && <FunctionPausedBanner />}
      <div>
        <WithdrawNote
          isScheduledWithdrawal={isScheduledWithdrawal}
          withdrawWindowInSeconds={withdrawWindowInSeconds}
          withdrawTokenSymbol={assetSymbol}
        />
        <LearnAboutFees />
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-8 justify-between h-full"
          onSubmit={form.handleSubmit(submit)}
        >
          <DepositAssetAmountInput />
          <DepositAssetFooter />
        </form>
      </Form>
      <TransactionFeedback transactionState={approveTxState} />
      <TransactionFeedback transactionState={depositTxState} />
    </div>
  );
};
