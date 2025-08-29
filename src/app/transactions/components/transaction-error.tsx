import { XIcon } from 'lucide-react';
import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import styles from './transaction-error.module.css';

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
      <AlertTitle>
        <span>Can't perform this transaction</span>
        <button onClick={resetTransactionState}>
          <XIcon />
        </button>
      </AlertTitle>
      {Boolean(error) && (
        <AlertDescription>
          <pre className={styles.errorPreview}>
            <code>{getErrorLog(error)}</code>
          </pre>
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
