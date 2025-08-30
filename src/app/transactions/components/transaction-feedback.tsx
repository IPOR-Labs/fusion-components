import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { TransactionLink } from '@/components/transaction-link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { AlertCircleIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Props {
  transactionState: TransactionState;
}

export const TransactionFeedback = ({
  transactionState,
}: Props) => {
  const { txStatus, resetTransactionState } = transactionState;

  if (txStatus.type === 'error') {
    const { error } = txStatus;

    return (
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>
          Can't perform this transaction
        </AlertTitle>
        {Boolean(error) && (
          <AlertDescription className="pt-4">
            <ScrollArea className="w-full overflow-auto">
              <pre>
                {getErrorLog(error)}
              </pre>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Button
              onClick={resetTransactionState}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <XIcon />
              Dismiss
            </Button>
          </AlertDescription>
        )}
      </Alert>
    );
  };

  if (txStatus.type === 'pending') {
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

  if (txStatus.type === 'success') {
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

  return null;
};

const getErrorLog = (originalError: unknown) => {
  const originalErrorMsg =
    originalError instanceof Error
      ? originalError.message
      : JSON.stringify(originalError);

  return originalErrorMsg;
};