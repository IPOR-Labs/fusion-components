import { useRevokeAllowance } from './context';
import { getNeedsRevokeApproval } from './utils/getNeedsRevokeApproval';

export const useNeedsRevokeApproval = () => {
  const {
    params: { allowance, newAllowance },
  } = useRevokeAllowance();

  const needsRevokeApproval = getNeedsRevokeApproval({
    currentAllowance: allowance,
    newAllowance,
  });

  return needsRevokeApproval;
};
