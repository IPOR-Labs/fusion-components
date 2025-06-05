import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import {
  useAssetAmount,
  useHandleMaxInstantWithdrawAmount,
  useInstantWithdrawAmount,
  useIsScheduledWithdrawal,
} from '../hybrid-withdraw.hooks';
import { Capacity } from '@/components/capacity/capacity';
import { Clock4Icon, InfoIcon, ZapIcon } from 'lucide-react';
import { TooltipContent, Tooltip, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { intervalToDuration } from 'date-fns';
import { formatDuration } from 'date-fns';
import { addSeconds } from 'date-fns';
import { format } from 'date-fns';
import { getNow } from '@/utils/getNow';
import { DATE_FORMAT_WITH_HOUR } from '@/utils/constants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatSignificant } from '@/utils/format-significant';

const MILLISECONDS_IN_SECOND = 1000n;
const SIGNIFICANT_DECIMALS = 3;

export const HybridWithdrawTypeOfWithdraw = () => {
  const isScheduledWithdrawal = useIsScheduledWithdrawal();

  if (isScheduledWithdrawal === undefined) return null;

  if (isScheduledWithdrawal) {
    return <ScheduledWithdraw />;
  }

  return <InstantWithdraw />;
};

const InstantWithdraw = () => {
  const {
    params: { assetDecimals, assetSymbol },
  } = useHybridWithdrawContext();
  const assetAmount = useAssetAmount();

  const instantWithdrawAmount = useInstantWithdrawAmount();
  const handleMaxInstantWithdrawAmount = useHandleMaxInstantWithdrawAmount();

  if (assetDecimals === undefined) return null;

  return (
    <TooltipProvider delayDuration={100} skipDelayDuration={100}>
      <Alert className="bg-ipor-asset/10 border-ipor-asset">
        <ZapIcon className="h-4 w-4 !text-yellow-500" />
        <AlertTitle className="flex gap-x-1 text-sm">
          <span>Withdrawal type: Instant</span>
          <Tooltip>
            <TooltipTrigger type="button">
              <InfoIcon size={16} />
            </TooltipTrigger>
            <TooltipContent>
              <Capacity
                current={assetAmount || 0n}
                max={instantWithdrawAmount || 0n}
                currentLabel="To withdraw"
                maxLabel="Max instant withdraw"
                howMuchLeftLabel="left to be withdrawn instantly"
                symbol={assetSymbol || ''}
                decimals={assetDecimals}
                onClickMax={handleMaxInstantWithdrawAmount}
                significantDecimals={SIGNIFICANT_DECIMALS}
              />
            </TooltipContent>
          </Tooltip>
        </AlertTitle>
        <AlertDescription className="text-xs">
          You can withdraw your assets instantly.
        </AlertDescription>
      </Alert>
    </TooltipProvider>
  );
};

const ScheduledWithdraw = () => {
  const {
    params: { withdrawWindowInSeconds, assetSymbol },
  } = useHybridWithdrawContext();

  if (withdrawWindowInSeconds === undefined) return null;

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
      <Alert className="">
        <Clock4Icon className="h-4 w-4" />
        <AlertTitle className="flex gap-x-1 text-sm">
          Withdrawal type: Scheduled ({formatedDuration})
          <Tooltip>
            <TooltipTrigger type="button">
              <InfoIcon size={16} />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-muted-foreground">
                That's a 2-step redemption process. First you need to request
                withdrawal, after that the vault manager has{' '}
                <strong className="text-primary">
                  at most {formatedDuration}
                </strong>{' '}
                to fulfill your request. In the second step you can withdraw the
                assets. If you request redemption now, you have to withdraw it
                by {redeemByDate}.{' '}
                {assetSymbol && (
                  <>
                    When withdrawing you will receive{' '}
                    <strong className="text-primary">{assetSymbol}</strong>.
                  </>
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </AlertTitle>
        <ScheduledWithdrawAlertDescription />
      </Alert>
    </TooltipProvider>
  );
};

const ScheduledWithdrawAlertDescription = () => {
  const {
    params: { withdrawWindowInSeconds, assetSymbol, assetDecimals },
  } = useHybridWithdrawContext();

  const instantWithdrawAmount = useInstantWithdrawAmount();
  const handleMaxInstantWithdrawAmount = useHandleMaxInstantWithdrawAmount();

  if (instantWithdrawAmount === undefined || assetDecimals === undefined) {
    return null;
  }

  if (instantWithdrawAmount > 0n) {
    return (
      <AlertDescription className="text-xs">
        <span>or</span>{' '}
        <button
          onClick={handleMaxInstantWithdrawAmount}
          className="text-ipor-asset underline font-semibold"
        >
          withdraw{' '}
          {formatSignificant(
            instantWithdrawAmount,
            assetDecimals,
            SIGNIFICANT_DECIMALS,
          )}{' '}
          {assetSymbol} now
        </button>
      </AlertDescription>
    );
  }

  const redeemByDate = format(
    addSeconds(getNow(), Number(withdrawWindowInSeconds)),
    DATE_FORMAT_WITH_HOUR,
  );

  return (
    <AlertDescription className="text-xs">
      Request redemption now and withdraw it by {redeemByDate}.
    </AlertDescription>
  );
};
