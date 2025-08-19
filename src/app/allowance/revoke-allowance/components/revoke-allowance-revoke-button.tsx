import { LoaderIcon } from 'lucide-react';
import { useRevokeAllowanceContext } from '../revoke-allowance.context';
import { useIsRevoking, useNeedsRevokeApproval } from '../revoke-allowance.hooks';
import { Button } from '@/components/ui/button';

export const RevokeAllowanceRevokeButton = () => {
  const {
    actions: { executeRevokeAllowance },
  } = useRevokeAllowanceContext();
  const isRevoking = useIsRevoking();
  const needsRevokeApproval = useNeedsRevokeApproval();

  if (isRevoking) {
    return (
      <div className="flex justify-center items-center gap-3 mb-2">
        <LoaderIcon className="h-4 w-4 animate-spin" />
        <span className="text-white font-medium">Revoking</span>
      </div>
    );
  }

  if (needsRevokeApproval) {
    return (
      <Button type="button" onClick={executeRevokeAllowance}>
        Revoke Approval
      </Button>
    );
  }

  return <div className="text-white font-medium mt-1 text-center">Revoked</div>;
};
