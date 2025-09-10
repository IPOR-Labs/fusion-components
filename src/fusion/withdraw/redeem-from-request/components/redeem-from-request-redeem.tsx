import { useConfigContext } from "@/app/config/config.context";
import { useAppSetup } from "@/app/use-app-setup";
import { getSwitchChainButtonLabel } from "@/app/wallet/utils/get-switch-chain-button-label";
import { Button } from "@/components/ui/button";
import { FunctionPausedBanner } from "@/fusion/prehooks/components/function-paused-banner";
import { useRedeemFromRequestContext } from "@/fusion/withdraw/redeem-from-request/redeem-from-request.context";
import { useTimer } from "@/fusion/withdraw/redeem-from-request/redeem-from-request.hooks";
import { Debouncer } from "@/lib/debouncer";
import { LoaderCircleIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

export const RedeemFromRequestRedeem = () => {
  const {
    params: {
      canWithdraw,
      requestedAmount,
      endWithdrawWindowTimestamp,
      withdrawWindowInSeconds,
      isRedeemFromRequestPaused,
    },
    actions: { executeRedeemFromRequest },
    txState,
  } = useRedeemFromRequestContext();

  const isPending = txState.txStatus.type === 'pending';

  /**
   * Debouncer is used to avoid displaying stale data.
   * When redeem is done but the requestInfo is still pending.
   */
  return (
    <div className="flex flex-col gap-2 -mb-7 items-end">
      {isRedeemFromRequestPaused && <FunctionPausedBanner />}
      <div className="flex flex-col gap-2 w-56">
        <Debouncer
          value={isPending ? 1 : 0}
          loader={<Pending timeToExpiration={'0'} showSubmitButton />}
          delay={2000}
        >
          <RedeemFromRequestRedeemDisplay
            showSubmitButton
            canWithdraw={canWithdraw || false}
            isPending={isPending}
            isPaused={isRedeemFromRequestPaused}
            requestedAmount={requestedAmount}
            onClickButton={executeRedeemFromRequest}
            endWithdrawWindowTimestamp={endWithdrawWindowTimestamp}
            withdrawWindowInSeconds={withdrawWindowInSeconds}
          />
        </Debouncer>
      </div>
    </div>
  );
};

const RedeemFromRequestRedeemDisplay = ({
  showSubmitButton,
  canWithdraw,
  isPending,
  isPaused,
  requestedAmount,
  onClickButton,
  endWithdrawWindowTimestamp,
  withdrawWindowInSeconds,
}: {
  showSubmitButton: boolean;
  requestedAmount: bigint | undefined;
  onClickButton: ((args: { shares: bigint }) => Promise<void>) | undefined;
  canWithdraw: boolean;
  isPending: boolean;
  endWithdrawWindowTimestamp: bigint | undefined;
  withdrawWindowInSeconds: bigint | undefined;
  isPaused?: boolean;
}) => {
  const { isExpired, isMatured, timeToMaturity, timeToExpiration } = useTimer({
    endWithdrawWindowTimestamp,
    withdrawWindowInSeconds,
  });

  if (isPending)
    return (
      <Pending
        timeToExpiration={timeToExpiration}
        showSubmitButton={showSubmitButton}
      />
    );

  if (isExpired) return <Expired showSubmitButton={showSubmitButton} />;

  if (canWithdraw)
    return (
      <Matured
        showSubmitButton={showSubmitButton}
        requestedAmount={requestedAmount}
        onClickButton={onClickButton}
        isPending={isPending}
        timeToExpiration={timeToExpiration}
        isPaused={Boolean(isPaused)}
      />
    );

  if (isMatured && !canWithdraw)
    return <NotReady showSubmitButton={showSubmitButton} />;

  return (
    <WaitingForMaturity
      timeToMaturity={timeToMaturity}
      showSubmitButton={showSubmitButton}
      timeToExpiration={timeToExpiration}
    />
  );
};

const WaitingForMaturity = ({
  timeToMaturity,
  showSubmitButton,
  timeToExpiration,
}: {
  timeToMaturity: string | undefined;
  showSubmitButton: boolean;
  timeToExpiration: string | undefined;
}) => {
  return (
    <>
      {showSubmitButton && (
        <Button variant="secondary" size="sm" disabled>
          Redeem
        </Button>
      )}
      <RedeemNote>Alpha prepping assets...</RedeemNote>
      <RedeemNote>
        <span className="text-destructive font-semibold">
          pending ({timeToMaturity} estimated)
        </span>
      </RedeemNote>
      <RedeemNote>Redeem deadline in</RedeemNote>
      <RedeemNote>
        <span className="text-destructive font-semibold">
          {timeToExpiration}
        </span>
      </RedeemNote>
    </>
  );
};

const Matured = ({
  showSubmitButton,
  requestedAmount,
  onClickButton,
  isPending,
  isPaused,
  timeToExpiration,
}: {
  showSubmitButton: boolean;
  requestedAmount: bigint | undefined;
  onClickButton: ((args: { shares: bigint }) => Promise<void>) | undefined;
  isPending: boolean;
  isPaused: boolean;
  timeToExpiration: string | undefined;
}) => {
  const { chainId } = useConfigContext();
  const { isWrongWalletChain, switchChain } = useAppSetup();
  
  if (requestedAmount === undefined || requestedAmount === 0n) return null;

  if (isWrongWalletChain) {
    return (
      <>
        <Button variant="secondary" size="sm" onClick={switchChain}>
          {getSwitchChainButtonLabel(chainId)}
        </Button>
        <RedeemNote>
          <span>Withdrawal request expires in</span>{' '}
          <span className="text-destructive font-semibold">
            {timeToExpiration}
          </span>
        </RedeemNote>
      </>
    );
  }

  return (
    <>
      {showSubmitButton && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onClickButton?.({ shares: requestedAmount })}
          disabled={isPending || isPaused}
        >
          {isPending ? 'Redeeming...' : 'Redeem'}
        </Button>
      )}
      <RedeemNote>
        <span>Withdrawal request expires in</span>{' '}
        <span className="text-destructive font-semibold">
          {timeToExpiration}
        </span>
      </RedeemNote>
    </>
  );
};

const Expired = ({ showSubmitButton }: { showSubmitButton: boolean }) => {
  return (
    <>
      {showSubmitButton && (
        <Button variant="secondary" size="sm" disabled>
          Redeem
        </Button>
      )}
      <RedeemNote>Withdrawal request has expired.</RedeemNote>
    </>
  );
};

const NotReady = ({ showSubmitButton }: { showSubmitButton: boolean }) => {
  return (
    <>
      {showSubmitButton && (
        <Button variant="secondary" size="sm" disabled>
          Redeem
        </Button>
      )}
      <RedeemNote>Withdrawal request is not ready yet.</RedeemNote>
    </>
  );
};

const Pending = ({
  showSubmitButton,
  timeToExpiration,
}: {
  showSubmitButton: boolean;
  timeToExpiration: string | undefined;
}) => {
  return (
    <>
      {showSubmitButton && (
        <Button className="gap-2" variant="secondary" size="sm" disabled>
          <LoaderCircleIcon className="w-4 h-4 animate-spin" />
          Redeeming...
        </Button>
      )}
      <RedeemNote>
        <span>Withdrawal request expires in</span>{' '}
        <span className="text-destructive font-semibold">
          {timeToExpiration}
        </span>
      </RedeemNote>
    </>
  );
};

const RedeemNote = (props: PropsWithChildren) => {
  return (
    <p className="text-xs font-regular text-muted-foreground">
      {props.children}
    </p>
  );
};
