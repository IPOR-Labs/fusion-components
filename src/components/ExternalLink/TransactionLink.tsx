import { type Hash } from 'viem';
import { truncate } from '@/utils/truncate';
import { ExternalLink } from '@/components/ExternalLink/ExternalLink';

interface Props {
  hash: Hash;
  explorerUrl: string;
  className?: string;
}

export const TransactionLink = ({ hash, explorerUrl, className }: Props) => {
  const blockExplorerHref = `${explorerUrl}/tx/${hash}`;
  const blockExplorerAnchor = `${explorerUrl}/tx/${truncate(hash)}`;

  return (
    <ExternalLink
      href={blockExplorerHref}
      title={`Check your transaction: ${hash}`}
      className={className}
    >
      {blockExplorerAnchor}
    </ExternalLink>
  );
};
