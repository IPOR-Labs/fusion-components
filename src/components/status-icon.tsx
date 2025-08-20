import { type ChainId } from '@/wagmi';
import { CircleXIcon, Loader2Icon } from 'lucide-react';
import { TokenIcon } from '@/components/token-icon';
import { type Address } from 'viem';
import styles from './status-icon.module.css';

interface Props {
  isError?: boolean;
  isLoading?: boolean;
  tokenAddress: Address | undefined;
  chainId: ChainId;
}

export const StatusIcon = ({
  isError,
  isLoading,
  tokenAddress,
  chainId,
}: Props) => {
  if (isError) {
    return <CircleXIcon className={styles.errorIcon} />;
  }
  if (isLoading) {
    return <Loader2Icon className={styles.loadingIcon} />;
  }
  if (tokenAddress !== undefined) {
    return (
      <TokenIcon chainId={chainId} address={tokenAddress} className={styles.icon} />
    );
  }
  return null;
};
