import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import styles from './approval-steps.module.css';

interface ApprovalStepsProps {
  needsApproval: boolean;
  isApproving: boolean;
}

export const ApprovalSteps = (props: ApprovalStepsProps) => {
  const { needsApproval, isApproving } = props;

  return (
    <div className={styles.container} data-testid="approval-steps">
      {!needsApproval && (
        <CheckIcon className={styles.checkIcon} />
      )}
      {needsApproval && <Circle approved={!needsApproval}>1</Circle>}
      <Line />
      <Circle disabled={needsApproval || isApproving}>2</Circle>
    </div>
  );
};

const Line = () => {
  return <div className={styles.line} />;
};

const Circle = (props: {
  children: ReactNode;
  approved?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div
      className={cn(styles.circle, {
        [styles.circleApproved]: props.approved,
        [styles.circleDisabled]: props.disabled,
      })}
    >
      {props.children}
    </div>
  );
};
