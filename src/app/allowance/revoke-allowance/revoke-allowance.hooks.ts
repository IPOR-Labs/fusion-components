import { useRevokeAllowanceContext } from './revoke-allowance.context';
import { getNeedsRevokeApproval } from '../utils/get-needs-revoke-approval';

export const useNeedsRevokeApproval = () => {
  const {
    params: { currentAllowance, newAllowance },
  } = useRevokeAllowanceContext();

  const needsRevokeApproval = getNeedsRevokeApproval({
    currentAllowance,
    newAllowance,
  });

  return needsRevokeApproval;
};

export const useIsRevoking = () => {
  const {
    revokeAllowanceTxState,
  } = useRevokeAllowanceContext();

  return revokeAllowanceTxState.txStatus.type === 'pending';
}
