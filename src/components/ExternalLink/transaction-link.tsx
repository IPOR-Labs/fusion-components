import { extractChain, type Hash } from 'viem';
import { truncate } from '@/utils/truncate';
import { ExternalLink } from '@/components/ExternalLink/external-link';
import { useAppContext } from '@/app/app.context';
import { chains } from '@/app/wagmi';

interface Props {
  hash: Hash;
  className?: string;
}

export const TransactionLink = ({ hash, className }: Props) => {
  const {
    chainId,
  } = useAppContext();
  const chain = extractChain({
    id: chainId,
    chains,
  });
  const explorerUrl = chain.blockExplorers?.default.url;

  if (explorerUrl === undefined) return null;

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
