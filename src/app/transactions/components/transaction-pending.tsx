import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { TransactionLink } from '@/components/ExternalLink/transaction-link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2Icon } from 'lucide-react';

interface Props {
  transactionState: TransactionState;
}

export const TransactionPending = ({
  transactionState,
}: Props) => {
  const { txStatus } = transactionState;

  if (txStatus.type !== 'pending') return null;

  return (
    <Alert>
      <Loader2Icon className="animate-spin" />
      <AlertTitle>
        <span>Transaction pending</span>
      </AlertTitle>
      <AlertDescription>
        <p>Preview in block explorer: <TransactionLink hash={txStatus.hash} /></p>
      </AlertDescription>
    </Alert>
  );
};
