import { type ChainId } from '@/app/config/wagmi';
import { CircleXIcon, Loader2Icon } from 'lucide-react';
import { TokenIcon } from '@/components/token-icon';
import { type Address } from 'viem';

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
    return <CircleXIcon className="w-6 h-6 text-destructive" />;
  }
  if (isLoading) {
    return <Loader2Icon className="w-6 h-6 animate-spin" />;
  }
  if (tokenAddress !== undefined) {
    return (
      <TokenIcon chainId={chainId} address={tokenAddress} className="w-6 h-6" />
    );
  }
  return null;
};
