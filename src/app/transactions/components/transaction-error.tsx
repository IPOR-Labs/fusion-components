import { Button } from '@/components/ui/button';
import { CircleXIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';

const SHOW_ORIGINAL_ERROR = true;

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
    <Card>
      <CardContent>
        <div className="flex justify-center -mb-4 -mt-8">
          <CircleXIcon className="w-10 h-10 text-destructive" />
        </div>
        {
          SHOW_ORIGINAL_ERROR && Boolean(error) && (
            <div className="text-left overflow-x-auto rounded bg-ipor-dark-1 border border-white/10 p-2">
              <pre>
                <code>{getErrorLog(error)}</code>
              </pre>
            </div>
          )
        }
        <CardFooter>
          <Button onClick={resetTransactionState}>
            Dismiss
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

const getErrorLog = (originalError: unknown) => {
  const originalErrorMsg =
    originalError instanceof Error
      ? originalError.message
      : JSON.stringify(originalError);

  return originalErrorMsg;
};
