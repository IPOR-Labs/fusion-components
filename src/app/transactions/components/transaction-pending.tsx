import { Loader2Icon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';

interface Props {
  transactionState: TransactionState;
}

export const TransactionPending = ({
  transactionState,
}: Props) => {
  const { txStatus } = transactionState;

  if (txStatus.type !== 'pending') return null;

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center -mb-4 -mt-8">
          <Loader2Icon className="w-10 h-10 text-destructive animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
};
