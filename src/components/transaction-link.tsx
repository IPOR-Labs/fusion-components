import { extractChain, type Hash } from 'viem';
import { truncate } from '@/lib/truncate';
import { ExternalLink } from '@/components/external-link';
import { useConfigContext } from "@/app/config/config.context";
import { chains } from '@/app/config/wagmi';

interface Props {
  hash: Hash;
  className?: string;
}

export const TransactionLink = ({ hash, className }: Props) => {
  const {
    chainId,
  } = useConfigContext();
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
