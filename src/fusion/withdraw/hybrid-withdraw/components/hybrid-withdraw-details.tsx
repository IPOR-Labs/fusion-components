import { type PropsWithChildren } from 'react';
import { HybridWithdrawFees } from './hybrid-withdraw-fees';
import { HybridWithdrawTypeOfWithdraw } from './hybrid-withdraw-type-of-withdraw';
import {
  useIsScheduledWithdrawal,
  useIsSubmitDisabled,
  useAssetAmount,
} from '../hybrid-withdraw.hooks';
import { InfoIcon } from 'lucide-react';
import styles from './hybrid-withdraw-details.module.css';

export const HybridWithdrawDetails = () => {
  const isScheduledWithdrawal = useIsScheduledWithdrawal();
  const isSubmitDisabled = useIsSubmitDisabled();
  const assetAmount = useAssetAmount();

  /**
   * @dev We don't want to show withdraw details if the submission is not possible
   */
  if (isSubmitDisabled) return <Placeholder />;
  /**
   * @dev We don't want to show withdraw details if amount is 0
   */
  if (assetAmount === undefined || assetAmount <= 0n) return <Placeholder />;

  if (isScheduledWithdrawal === undefined) {
    return <Placeholder />;
  }

  return (
    <Placeholder>
      <HybridWithdrawTypeOfWithdraw />
      <HybridWithdrawFees />
    </Placeholder>
  );
};

const Placeholder = (props: PropsWithChildren) => {
  const hasChildren = Boolean(props.children);

  if (hasChildren) {
    return <div className={styles.root}>{props.children}</div>;
  }

  return (
    <div className={styles.placeholder}>
      <div className={styles.placeholderContent}>
        <InfoIcon className="h-4 w-4" />
        <p>Please fill in the amount to see the details.</p>
      </div>
    </div>
  );
};
