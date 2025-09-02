import { RevokeCashLink } from '@/components/revoke-cash-link';
import { FullNumber } from '@/components/full-number';
import { LoaderIcon } from 'lucide-react';
import { parseUnits } from 'viem';
import { useAppSetup } from '@/app/use-app-setup';
import { formatSignificant } from '@/lib/format-significant';

const MAX_ALLOWANCE_BEFORE_UNLIMITED = '1000000000000000';

interface Props {
  state: 'pending' | 'approved';
  decimals: number;
  allowance: bigint;
}

export const ApprovalText = ({
  state,
  decimals,
  allowance,
}: Props) => {
  const {
    accountAddress
  } = useAppSetup();

  const allowanceBeforeUnlimitedParsed = parseUnits(
    MAX_ALLOWANCE_BEFORE_UNLIMITED,
    decimals,
  );
  const isUnlimited = allowance > allowanceBeforeUnlimitedParsed;
  const isZero = allowance <= 0n;

  const formattedAllowance = formatSignificant(allowance, decimals);

  return (
    <div className="flex flex-col items-center mb-2">
      <div data-testid="approval-text" className="text-white font-medium">
        {state === 'pending' && (
          <div className="flex gap-3">
            <LoaderIcon className="h-4 w-4 animate-spin" />
            <span>Approving</span>
          </div>
        )}
        {state === 'approved' && (
          <>
            Approved:{' '}
            {!isUnlimited && (
              <span className="text-lg">
                <FullNumber value={allowance} decimals={decimals}>
                  {formattedAllowance}
                </FullNumber>
              </span>
            )}
            {isUnlimited && 'Unlimited'}
          </>
        )}
      </div>
      {!isZero && accountAddress && state === 'approved' && (
        <div className="text-xs">
          <RevokeCashLink accountAddress={accountAddress} />
        </div>
      )}
    </div>
  );
};
