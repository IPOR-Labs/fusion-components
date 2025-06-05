import { useActions } from './actions';
import { useContextState } from './contextState';
import { useParams } from './params';
import { RevokeAllowanceProvider } from './context';
import { Content } from './content';
import { type Address } from 'viem';
import { type ChainId } from '@/app/wagmi';

interface Props {
  chainId: ChainId;
  tokenAddress: Address;
  spender: Address;
  newAllowance: bigint;
  onDone: () => void;
  onUpdateAllowance: (newAllowance: bigint) => void;
}

export const RevokeAllowance = ({
  chainId,
  tokenAddress,
  spender,
  newAllowance,
  onDone,
  onUpdateAllowance,
}: Props) => {
  const params = useParams({
    chainId,
    tokenAddress,
    spender,
    newAllowance,
    onDone,
    onUpdateAllowance,
  });
  const state = useContextState({
    params,
  });
  const actions = useActions({
    params,
    state,
  });

  return (
    <RevokeAllowanceProvider params={params} state={state} actions={actions}>
      <Content />
    </RevokeAllowanceProvider>
  );
};
