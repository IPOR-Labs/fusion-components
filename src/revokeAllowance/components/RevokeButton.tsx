import { LoaderIcon } from 'lucide-react';
import { useRevokeAllowance } from '../context';
import { useNeedsRevokeApproval } from '../contextHooks';
import { Button } from '@/components/ui/button';

export const RevokeButton = () => {
  const {
    params: { isRevoking },
    actions: { revokeAllowance },
  } = useRevokeAllowance();
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
      <Button type="button" onClick={revokeAllowance}>
        Revoke Approval
      </Button>
    );
  }

  return <div className="text-white font-medium mt-1 text-center">Revoked</div>;
};
