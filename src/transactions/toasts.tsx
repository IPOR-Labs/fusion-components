import { TransactionLink } from '@/components/ExternalLink/TransactionLink';
import { toast } from 'sonner';
import { formatNumber } from '@/utils/format-number';
import { type Transaction } from '@/transactions/types';
import { TX_TOAST_MESSAGE } from './messages';
import { ONE_CENT } from '@/utils/constants';
import { useWallet } from '@/wallet/context';

const TOAST_TIME = 10000;

export const transactionToastStart = (tx: Transaction) => {
  return toast.loading(TX_TOAST_MESSAGE[tx.type].PENDING, {
    description: <TransactionDescription {...tx} />,
    duration: Infinity,
    id: tx.hash,
  });
};

export const transactionToastSuccess = (tx: Transaction) => {
  return toast.success(TX_TOAST_MESSAGE[tx.type].SUCCESS, {
    description: <TransactionDescription {...tx} />,
    duration: TOAST_TIME,
    id: tx.hash,
  });
};

export const transactionToastAddedToSafeWallet = () => {
  return toast.success('Transaction added to Safe wallet', {
    description: 'Go to Safe to see the transaction',
    duration: TOAST_TIME,
  });
};

export const transactionToastError = (tx: Transaction) => {
  return toast.error(TX_TOAST_MESSAGE[tx.type].ERROR, {
    description: <TransactionDescription {...tx} />,
    duration: TOAST_TIME,
    id: tx.hash,
  });
};

const TransactionDescription = (tx: Transaction) => {
  const { hash, data } = tx;
  const { blockExplorerUrl } = useWallet();

  return (
    <>
      {data.state === 'pending' && (
        <p className="text-xs">{TX_TOAST_MESSAGE[tx.type].PENDING_SECONDARY}</p>
      )}
      {data.state === 'success' && (
        <SavedGasCostMessage savedGasCost={data.savedGasCost} />
      )}
      {blockExplorerUrl && (
        <p className="text-sm theme-default">
          <TransactionLink explorerUrl={blockExplorerUrl} hash={hash} />
        </p>
      )}
    </>
  );
};

const SavedGasCostMessage = ({
  savedGasCost,
}: {
  savedGasCost: bigint | undefined;
}) => {
  const showTextGasSaved = savedGasCost && savedGasCost > ONE_CENT;

  if (!showTextGasSaved) {
    return null;
  }

  return (
    <p className="text-sm">
      You saved $<strong>{formatNumber(savedGasCost, 18)}</strong> as the actual
      gas cost was lower than the estimated Ethereum network fee.
    </p>
  );
};
