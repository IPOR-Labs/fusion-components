import { Button } from '@/components/ui/button';
import { useRevokeAllowance } from '../context';
import { useNeedsRevokeApproval } from '../contextHooks';

export const ReaproveButton = () => {
  const {
    actions: { reapprove },
  } = useRevokeAllowance();
  const needsRevokeApproval = useNeedsRevokeApproval();

  return (
    <Button
      type="button"
      variant={needsRevokeApproval ? 'secondary' : 'default'}
      disabled={needsRevokeApproval}
      onClick={reapprove}
    >
      Set Approval
    </Button>
  );
};
