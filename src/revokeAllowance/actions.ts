import { useState } from 'react';
import { type Params } from './params';
import { type ContextState } from './contextState';
import { useRevokeAllowance } from './actions/revokeAllowance';
import { useReapprove } from './actions/reapprove';
import { getNeedsRevokeApproval } from '@/revokeAllowance/utils/getNeedsRevokeApproval';

interface Args {
  params: Params;
  state: ContextState;
}

export const useActions = ({
  params: {
    chainId,
    tokenAddress,
    allowance,
    isRevoking,
    newAllowance,
    onUpdateAllowance,
    spender,
  },
  state: { reapproveTransactionStateHandlers, revokeTransactionStateHandlers },
}: Args) => {
  const [allowanceFromEvent, setAllowanceFromEvent] = useState<bigint>();
  const currentAllowance = allowanceFromEvent ?? allowance;

  const needsRevokeApproval = getNeedsRevokeApproval({
    currentAllowance,
    newAllowance,
  });

  const { execute: revokeAllowance } = useRevokeAllowance({
    transactionStateHandlers: revokeTransactionStateHandlers,
    isReady: needsRevokeApproval && !isRevoking,
    chainId,
    spender,
    tokenAddress,
    onUpateAllowance: (newAllowance) => {
      setAllowanceFromEvent(newAllowance);
      onUpdateAllowance(newAllowance);
    },
  });

  const { execute: reapprove } = useReapprove({
    chainId,
    spender,
    tokenAddress,
    amount: newAllowance,
    transactionStateHandlers: reapproveTransactionStateHandlers,
    onUpateAllowance: (newAllowance) => {
      setAllowanceFromEvent(newAllowance);
      onUpdateAllowance(newAllowance);
    },
  });

  return {
    revokeAllowance,
    reapprove,
  };
};

export type Actions = ReturnType<typeof useActions>;
