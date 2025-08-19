import { Button } from '@/components/ui/button';
import { useRevokeAllowanceContext } from '../revoke-allowance.context';
import { useNeedsRevokeApproval } from '../revoke-allowance.hooks';

export const RevokeAllowanceReaproveButton = () => {
  const {
    actions: { executeReapprove },
  } = useRevokeAllowanceContext();
  const needsRevokeApproval = useNeedsRevokeApproval();

  return (
    <Button
      type="button"
      variant={needsRevokeApproval ? 'secondary' : 'default'}
      disabled={needsRevokeApproval}
      onClick={executeReapprove}
    >
      Set Approval
    </Button>
  );
};
