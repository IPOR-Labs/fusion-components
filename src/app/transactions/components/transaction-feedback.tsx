import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { TransactionSuccess } from './transaction-success';
import { TransactionError } from './transaction-error';
import { TransactionPending } from './transaction-pending';

interface Props {
  transactionState: TransactionState;
}

export const TransactionFeedback = ({
  transactionState,
}: Props) => {
  return (
    <div>
      <TransactionError transactionState={transactionState} />
      <TransactionPending transactionState={transactionState} />
      <TransactionSuccess transactionState={transactionState} />
    </div>
  );
};