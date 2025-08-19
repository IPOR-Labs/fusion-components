import { type Params } from './revoke-allowance.params';
import { useRevokeAllowance } from '../actions/revoke-allowance.action';
import { useReapprove } from '../actions/reapprove.action';
import { getNeedsRevokeApproval } from '../utils/get-needs-revoke-approval';

interface Args {
  params: Params;
}

export const useActions = ({
  params: {
    chainId,
    tokenAddress,
    currentAllowance,
    newAllowance,
    handleUpdateAllowance,
    spender,
  },
}: Args) => {
  const needsRevokeApproval = getNeedsRevokeApproval({
    currentAllowance,
    newAllowance,
  });

  const { execute: executeRevokeAllowance } = useRevokeAllowance({
    isReady: needsRevokeApproval,
    chainId,
    spender,
    tokenAddress,
    transactionStateHandlers: {
      onSuccess: ({ receipt }) => {
        handleUpdateAllowance(receipt);
      },
    },
  });

  const { execute: executeReapprove } = useReapprove({
    chainId,
    spender,
    tokenAddress,
    amount: newAllowance,
    transactionStateHandlers: {
      onSuccess: ({ receipt }) => {
        handleUpdateAllowance(receipt);
      },
    },
  });

  return {
    executeRevokeAllowance,
    executeReapprove,
  };
};

export type Actions = ReturnType<typeof useActions>;
