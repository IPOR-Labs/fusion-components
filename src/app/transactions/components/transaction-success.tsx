import { CircleCheckIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { TransactionLink } from '@/components/ExternalLink/transaction-link';

interface Props {
  transactionState: TransactionState;
}

export const TransactionSuccess = ({
  transactionState,
}: Props) => {
  const { txStatus } = transactionState;

  if (txStatus.type !== 'success') return null;

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center -mb-4 -mt-8">
          <CircleCheckIcon className="w-10 h-10 text-destructive" />
        </div>
        <TransactionLink hash={txStatus.hash} />
      </CardContent>
    </Card>
  );
};
