import { RevokeCashLink } from '@/components/ExternalLink/revoke-cash-link';
import { FullNumber } from '@/components/full-number';
import { formatNumber } from '@/lib/format-number';
import { LoaderIcon } from 'lucide-react';
import { type Address, parseUnits } from 'viem';

const MAX_ALLOWANCE_BEFORE_UNLIMITED = '1000000000000000';

interface ApprovalTextProps {
  state: 'pending' | 'approved';
  decimals: number;
  allowance: bigint;
  accountAddress: Address | undefined;
  visibleDecimals?: number;
}

export const ApprovalText = (props: ApprovalTextProps) => {
  const {
    state,
    decimals,
    allowance,
    visibleDecimals = 2,
    accountAddress,
  } = props;

  const allowanceBeforeUnlimitedParsed = parseUnits(
    MAX_ALLOWANCE_BEFORE_UNLIMITED,
    decimals,
  );
  const isUnlimited = allowance > allowanceBeforeUnlimitedParsed;
  const isZero = allowance <= 0n;

  const formattedAllowance = formatNumber(allowance, decimals, visibleDecimals);

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
