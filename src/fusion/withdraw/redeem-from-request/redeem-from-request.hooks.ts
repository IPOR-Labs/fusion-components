import { useState } from 'react';
import { useEffect } from 'react';
import { type Duration, isAfter } from 'date-fns';
import { formatDuration, intervalToDuration } from 'date-fns';
import { getNow } from '@/lib/get-now';

export const useTimer = ({
  endWithdrawWindowTimestamp,
  withdrawWindowInSeconds,
}: {
  endWithdrawWindowTimestamp: bigint | undefined;
  withdrawWindowInSeconds: bigint | undefined;
}) => {
  const timestamps = useTimestamps({
    endWithdrawWindowTimestamp,
    withdrawWindowInSeconds,
  });

  const [timeToExpiration, setTimeToExpiration] = useState<string>();
  const [timeToMaturity, setTimeToMaturity] = useState<string>();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isMatured, setIsMatured] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      if (timestamps === undefined) return;

      const now = getNow();

      setTimeToExpiration(getFormatedDuration(timestamps.expireTimestamp));
      setTimeToMaturity(
        getFormatedDuration(timestamps.maturityTimestamp, [
          'days',
          'hours',
          'minutes',
        ]),
      );
      setIsExpired(isAfter(now, timestamps.expireTimestamp));
      setIsMatured(isAfter(now, timestamps.maturityTimestamp));
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [timestamps]);

  return {
    timeToExpiration,
    timeToMaturity,
    isExpired,
    isMatured,
  };
};

const MILLISECONDS_IN_SECOND = 1000n;

const useTimestamps = ({
  endWithdrawWindowTimestamp,
  withdrawWindowInSeconds,
}: {
  endWithdrawWindowTimestamp: bigint | undefined;
  withdrawWindowInSeconds: bigint | undefined;
}) => {
  if (endWithdrawWindowTimestamp === undefined) return undefined;
  if (withdrawWindowInSeconds === undefined) return undefined;

  const secondsForRedeeming = withdrawWindowInSeconds / 2n;

  const expireTimestamp = Number(
    endWithdrawWindowTimestamp * MILLISECONDS_IN_SECOND,
  );
  const maturityTimestamp = Number(
    (endWithdrawWindowTimestamp - secondsForRedeeming) * MILLISECONDS_IN_SECOND,
  );

  return { expireTimestamp, maturityTimestamp };
};

const getFormatedDuration = (
  end: number,
  format: (keyof Duration)[] = ['days', 'hours', 'minutes', 'seconds'],
) => {
  const newDuration = intervalToDuration({
    start: getNow(),
    end,
  });
  const formattedDuration =
    formatDuration(newDuration, {
      format,
    }) || '0 seconds';

  return formattedDuration
    .replace(' seconds', 's')
    .replace(' second', 's')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd');
};
