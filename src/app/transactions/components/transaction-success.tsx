import type { TransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { TransactionLink } from '@/components/ExternalLink/transaction-link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckIcon } from 'lucide-react';
import styles from './transaction-success.module.css';

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
      <AlertTitle>
        <span>Transaction successful</span>
        <CheckIcon className={styles.checkIcon} />
      </AlertTitle>
      <AlertDescription>
        <p>Preview in block explorer: <TransactionLink hash={txStatus.hash} /></p>
      </AlertDescription>
    </Alert>
  );
};
