import { Progress } from '@/components/ui/progress';
import { formatSignificant } from '@/lib/format-significant';
import { formatUnits, parseUnits } from 'viem';
import { cn } from '@/lib/utils';
import styles from './capacity.module.css';

interface Props {
  max: bigint;
  maxLabel: string;
  current: bigint;
  currentLabel: string;
  decimals: number;
  significantDecimals?: number;
  howMuchLeftLabel: string;
  symbol: string;
  onClickMax?: () => void;
}

const DEFAULT_SIGNIFICANT_DECIMALS = 3;

export const Capacity = ({
  max,
  maxLabel,
  current,
  currentLabel,
  decimals,
  significantDecimals = DEFAULT_SIGNIFICANT_DECIMALS,
  howMuchLeftLabel,
  symbol,
  onClickMax,
}: Props) => {
  const isMaxZero = max === 0n;

  const percentFilled = isMaxZero
    ? 0n
    : ((current * parseUnits('1', decimals)) / max) * 100n;
  const percentFilledNumber = Number(formatUnits(percentFilled, decimals));
  const remaining = max - current;
  const remainingOrZero = remaining < 0n ? 0n : remaining;

  const maxLabelDisplay = (
    <span>
      {maxLabel}: {formatSignificant(max, decimals, significantDecimals)}{' '}
      {symbol}
    </span>
  );

  const maxLabelDisplayOrButton = onClickMax ? (
    <button
      type="button"
      onClick={onClickMax}
      disabled={!onClickMax}
      className={cn({
        [styles.maxButton]: onClickMax,
      })}
    >
      {maxLabelDisplay}
    </button>
  ) : (
    maxLabelDisplay
  );

  return (
    <div className={styles.container}>
      <p className={styles.header}>
        <span>
          {currentLabel}:{' '}
          {formatSignificant(current, decimals, significantDecimals)} {symbol}
        </span>
        {maxLabelDisplayOrButton}
      </p>
      <Progress
        value={percentFilledNumber}
        className={styles.progress}
      />
      <p className={styles.footer}>
        <span className={styles.remainingAmount}>
          {formatSignificant(remainingOrZero, decimals, significantDecimals)}{' '}
          {symbol}
        </span>{' '}
        {howMuchLeftLabel}
      </p>
    </div>
  );
};
