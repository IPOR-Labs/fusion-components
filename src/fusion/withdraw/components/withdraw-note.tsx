import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  addSeconds,
  format,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import { InfoIcon } from 'lucide-react';
import { DATE_FORMAT_WITH_HOUR } from '@/utils/constants';
import { getNow } from '@/utils/get-now';

const MILLISECONDS_IN_SECOND = 1000n;

interface Props {
  isScheduledWithdrawal: boolean | undefined;
  withdrawWindowInSeconds: bigint | undefined;
  withdrawTokenSymbol: string | undefined;
}

export const WithdrawNote = ({
  isScheduledWithdrawal,
  withdrawWindowInSeconds,
  withdrawTokenSymbol,
}: Props) => {
  if (isScheduledWithdrawal === undefined) {
    return <Skeleton className="h-9" />;
  }

  if (isScheduledWithdrawal === false) {
    return (
      <p className="text-sm text-muted-foreground pb-4">
        You can withdraw assets at any time
      </p>
    );
  }

  if (withdrawWindowInSeconds === undefined) {
    return <Skeleton className="h-24" />;
  }

  const duration = intervalToDuration({
    start: 0,
    end: Number((withdrawWindowInSeconds / 2n) * MILLISECONDS_IN_SECOND),
  });
  const formatedDuration =
    formatDuration(duration, {
      format: ['days', 'hours', 'minutes', 'seconds'],
    }) || '0 seconds';

  const redeemByDate = format(
    addSeconds(getNow(), Number(withdrawWindowInSeconds)),
    DATE_FORMAT_WITH_HOUR,
  );

  return (
    <TooltipProvider delayDuration={100} skipDelayDuration={100}>
      <p className="flex items-center gap-1 text-sm text-muted-foreground pb-4">
        <span>Withdraw: Scheduled ({formatedDuration})</span>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon size={16} />
          </TooltipTrigger>
          <TooltipContent className="max-w-80">
            <p>
              This vault has a 2-step redemption process. First you need to
              request withdrawal, after that the vault manager has
              <strong>at most {formatedDuration}</strong> to fulfill your
              request. In the second step you can withdraw the assets. If you
              request redemption now, you have to withdraw it by {redeemByDate}.{' '}
              {withdrawTokenSymbol && (
                <>
                  When withdrawing you will receive{' '}
                  <strong>{withdrawTokenSymbol}</strong>.
                </>
              )}
            </p>
          </TooltipContent>
        </Tooltip>
      </p>
    </TooltipProvider>
  );
};
