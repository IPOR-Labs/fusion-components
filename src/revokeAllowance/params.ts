import { type ChainId } from '@/app/wagmi';
import { useRevokeTokenAllowance } from '@/revokeAllowance/hooks/useRevokeTokenAllowance';
import { useIsTxPending } from '@/transactions/hooks';
import { type Address } from 'viem';

interface Args {
  chainId: ChainId;
  tokenAddress: Address;
  spender: Address;
  newAllowance: bigint;
  onDone: () => void;
  onUpdateAllowance: (newAllowance: bigint) => void;
}

export const useParams = ({
  chainId,
  tokenAddress,
  spender,
  newAllowance,
  onDone,
  onUpdateAllowance,
}: Args) => {
  const allowance = useRevokeTokenAllowance({ chainId, tokenAddress, spender });

  const isRevoking = useIsTxPending('revokeAllowance');

  return {
    chainId,
    tokenAddress,
    spender,
    isRevoking,
    allowance,
    newAllowance,
    onDone,
    onUpdateAllowance,
  };
};

export type Params = ReturnType<typeof useParams>;
