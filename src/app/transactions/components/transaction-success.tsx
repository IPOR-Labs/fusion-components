import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { TransactionLink } from '@/components/ExternalLink/transaction-link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckIcon } from 'lucide-react';

interface Props {
  transactionState: TransactionState;
}

export const TransactionSuccess = ({
  transactionState,
}: Props) => {
  const { txStatus } = transactionState;

  if (txStatus.type !== 'success') return null;

  return (
    <Alert>
      <CheckIcon className="text-green-800!" />
      <AlertTitle>
        Transaction successful
      </AlertTitle>
      <AlertDescription>
        <p>Preview in block explorer: <TransactionLink hash={txStatus.hash} /></p>
      </AlertDescription>
    </Alert>
  );
};
