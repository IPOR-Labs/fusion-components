import { ApprovalSteps } from '@/components/ApprovalSteps/ApprovalSteps';
import { RevokeButton } from './RevokeButton';
import { ReaproveButton } from './ReaproveButton';
import { useNeedsRevokeApproval } from '../contextHooks';
import { useRevokeAllowance } from '../context';

export const Revoke = () => {
  const {
    params: { isRevoking },
  } = useRevokeAllowance();
  const needsRevokeApproval = useNeedsRevokeApproval();

  return (
    <div className="space-y-4 -mx-8">
      <div className="w-1/2 mx-auto">
        <ApprovalSteps
          needsApproval={needsRevokeApproval}
          isApproving={isRevoking}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 mx-8">
        <RevokeButton />
        <ReaproveButton />
      </div>
    </div>
  );
};
