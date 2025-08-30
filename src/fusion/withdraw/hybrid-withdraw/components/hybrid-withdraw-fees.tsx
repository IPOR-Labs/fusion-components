import { formatNumber } from '@/lib/format-number';
import { DEFAULT_DECIMALS, ONE_ETHER } from '@/lib/constants';
import { formatSignificant } from '@/lib/format-significant';
import { FullNumber } from '@/components/full-number';
import { TooltipTrigger, Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import {
  useAssetAmount,
  useIsScheduledWithdrawal,
} from '../hybrid-withdraw.hooks';

const REQUEST_FEE_MESSAGE = `Fee is charged immediately after scheduling a withdraw. Canceling or updating scheduled withdrawal will result in the loss of fee amount. Shares charged as fee are burned increasing value of remaining shares.`;


export const HybridWithdrawFees = () => {
  const isScheduledWithdrawal = useIsScheduledWithdrawal();

  if (isScheduledWithdrawal === undefined) return null;

  if (isScheduledWithdrawal) {
    return (
      <div data-testid="scheduled-withdraw-fee">
        <ScheduledWithdrawFee />
      </div>
    );
  }

  return (
    <div data-testid="instant-withdraw-fee">
      <InstantWithdrawFee />
    </div>
  );
};

const InstantWithdrawFee = () => {
  const amount = useAssetAmount();
  const {
    params: { withdrawFee, assetDecimals, assetSymbol = '' },
  } = useHybridWithdrawContext();

  return (
    <Fee
      fee={withdrawFee}
      label="Withdrawal Fee"
      assetDecimals={assetDecimals}
      assetSymbol={assetSymbol}
      baseAmount={amount}
    />
  );
};

const ScheduledWithdrawFee = () => {
  const amount = useAssetAmount();
  const {
    params: { requestFee, assetDecimals, assetSymbol = '' },
  } = useHybridWithdrawContext();

  return (
    <Fee
      fee={requestFee}
      label="Scheduled Withdrawal Fee"
      tooltip={REQUEST_FEE_MESSAGE}
      testId="scheduled-withdraw-request-fee"
      assetDecimals={assetDecimals}
      assetSymbol={assetSymbol}
      baseAmount={amount}
    />
  );
};

const Fee = ({
  fee,
  label,
  tooltip,
  testId,
  assetDecimals,
  assetSymbol,
  baseAmount,
}: {
  fee: bigint | undefined;
  label: string;
  tooltip?: string;
  testId?: string;
  assetDecimals: number | undefined;
  assetSymbol: string;
  baseAmount: bigint | undefined;
}) => {
  if (fee === undefined || fee === 0n || assetDecimals === undefined) {
    return null;
  }
  const feeInPercentage = fee ? fee * 100n : 0n;
  const amountAfterFee = ((baseAmount || 0n) * fee) / ONE_ETHER;

  return (
    <div className="flex space-x-4" data-testid={testId}>
      <div className="flex space-x-2 font-medium">
        <span>
          {formatNumber(feeInPercentage, DEFAULT_DECIMALS, 2)}% {label}
        </span>
        {tooltip && (
          <TooltipProvider delayDuration={100} skipDelayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon size={16} />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-muted-foreground">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="text-muted-foreground">
        <FullNumber value={amountAfterFee}>
          {formatSignificant(amountAfterFee, assetDecimals)}
        </FullNumber>{' '}
        {assetSymbol}
      </div>
    </div>
  );
};
