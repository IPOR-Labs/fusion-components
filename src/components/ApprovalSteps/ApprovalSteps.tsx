import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

interface ApprovalStepsProps {
  needsApproval: boolean;
  isApproving: boolean;
}

export const ApprovalSteps = (props: ApprovalStepsProps) => {
  const { needsApproval, isApproving } = props;

  return (
    <div className="w-full flex items-center" data-testid="approval-steps">
      {!needsApproval && (
        <CheckIcon className="h-6 w-6" />
      )}
      {needsApproval && <Circle approved={!needsApproval}>1</Circle>}
      <Line />
      <Circle disabled={needsApproval || isApproving}>2</Circle>
    </div>
  );
};

const Line = () => {
  return <div className="h-0.5 bg-ipor-asset/40 flex-1" />;
};

const Circle = (props: {
  children: ReactNode;
  approved?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-6 h-6 rounded-full text-ipor-asset font-semi-bold border border-ipor-asset text-xs',
        {
          'border-none': props.approved,
          'text-ipor-grey-7 bg-ipor-asset/20  border-none': props.disabled,
        },
      )}
    >
      {props.children}
    </div>
  );
};
