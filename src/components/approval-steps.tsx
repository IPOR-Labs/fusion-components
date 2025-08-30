import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ApprovalStepsProps {
  needsApproval: boolean;
  isApproving: boolean;
}

export const ApprovalSteps = (props: ApprovalStepsProps) => {
  const { needsApproval, isApproving } = props;

  return (
    <div className="w-full flex items-center" data-testid="approval-steps">
      {!needsApproval && (
        <div className="h-6 w-6">
          <ApprovedIcon />
        </div>
      )}
      {needsApproval && <Circle approved={!needsApproval}>1</Circle>}
      <Line />
      <Circle disabled={needsApproval || isApproving}>2</Circle>
    </div>
  );
};

const Line = () => {
  return <div className="h-0.5 bg-[var(--brand-1)]/40 flex-1" />;
};

const Circle = (props: {
  children: ReactNode;
  approved?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-6 h-6 rounded-full text-[var(--brand-1)] font-semi-bold border border-[var(--brand-1)] text-xs',
        {
          'border-none': props.approved,
          'text-[var(--muted-foreground)] bg-[var(--brand-1)]/20 border-none': props.disabled,
        },
      )}
    >
      {props.children}
    </div>
  );
};

const ApprovedIcon = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 17 17">
      <g transform="translate(-436 -710)">
        <circle
          cx="8.5"
          cy="8.5"
          r="7.5"
          transform="translate(436 710)"
          fill="#244148"
          stroke="#68AD96"
          strokeWidth="1"
        />
        <path
          d="M1239.024,125.079l2.612,2.613,5.849-6"
          transform="translate(-798.754 593.808)"
          fill="none"
          stroke="#68AD96"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

