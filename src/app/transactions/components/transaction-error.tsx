import { AlertCircleIcon, XIcon } from 'lucide-react';
import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

interface Props {
  transactionState: TransactionState;
}

export const TransactionError = ({
  transactionState,
}: Props) => {
  const {
    resetTransactionState,
    txStatus,
  } = transactionState;

  if (txStatus.type !== 'error') return null;

  const { error } = txStatus;

  return (
    <Alert>
      <AlertCircleIcon />
      <AlertTitle>
        Can't perform this transaction
      </AlertTitle>
      {Boolean(error) && (
        <AlertDescription>
          <pre className="overflow-auto pb-4">
            <code>{getErrorLog(error)}</code>
          </pre>
          <Button
            onClick={resetTransactionState}
            variant="outline"
            size="sm"
          >
            <XIcon />
            Dismiss
          </Button>
        </AlertDescription>
      )}
    </Alert>
  );
};

const getErrorLog = (originalError: unknown) => {
  const originalErrorMsg =
    originalError instanceof Error
      ? originalError.message
      : JSON.stringify(originalError);

  return originalErrorMsg;
};
