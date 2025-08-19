import { ApprovalSteps } from '@/components/ApprovalSteps/ApprovalSteps';
import { RevokeAllowanceRevokeButton } from './revoke-allowance-revoke-button';
import { RevokeAllowanceReaproveButton } from './revoke-allowance-reaprove-button';
import { useIsRevoking, useNeedsRevokeApproval } from '../revoke-allowance.hooks';

export const RevokeAllowanceRevoke = () => {
  const isRevoking = useIsRevoking();
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
        <RevokeAllowanceRevokeButton />
        <RevokeAllowanceReaproveButton />
      </div>
    </div>
  );
};
