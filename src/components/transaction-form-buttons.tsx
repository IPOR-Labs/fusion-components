import { extractChain, type Address } from 'viem';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { getSwitchChainButtonLabel } from '@/app/wallet/utils/get-switch-chain-button-label';
import { chains } from '@/app/config/wagmi';
import { cn } from '@/lib/utils';
import { ApprovalSteps } from '@/components/approval-steps';
import { ApprovalText } from '@/components/approval-text';
import { TokenIcon } from '@/components/token-icon';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useAppSetup } from '@/app/use-app-setup';
import { useConfigContext } from '@/app/config/config.context';

type Props = {
  isSubmitDisabled: boolean;
  transactionSubmitButtonText: string;
  isLoading: boolean;
  approvalProps?: {
    decimals: number | undefined;
    isApproving: boolean;
    needsApproval: boolean;
    allowance: bigint | undefined;
    needsRevokeBeforeApproval: boolean;
    assetAddress: Address;
    assetSymbol: string;
  };
};

export const TransactionFormButtons = (props: Props) => {
  const {
    accountAddress,
    isWrongWalletChain,
  } = useAppSetup();

  const isWalletConnected = accountAddress !== undefined;

  return (
    <div className="space-y-4 ">
      {props.approvalProps?.needsApproval && props.approvalProps?.needsRevokeBeforeApproval && (
        <Alert>
          <AlertTitle className="flex items-center gap-2">
            <TokenIcon
              address={props.approvalProps?.assetAddress}
              className='h-4 w-4'
            />
            <span>
              {props.approvalProps?.assetSymbol} requires revoking approval before approving higher value
            </span>
          </AlertTitle>
        </Alert>
      )}
      <div className="-mx-8">
        <div className="w-1/2 mx-auto">
          <ApprovalSteps
            needsApproval={
              props.approvalProps?.needsApproval ||
              isWrongWalletChain ||
              !isWalletConnected
            }
            isApproving={props.approvalProps?.isApproving || false}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 items-center">
        <Buttons {...props} />
      </div>
    </div>
  );
};

const Buttons = ({
  transactionSubmitButtonText,
  isSubmitDisabled,
  isLoading,
  approvalProps,
}: Props) => {
  const {
    switchChain,
    accountAddress,
    isWrongWalletChain,
  } = useAppSetup();
  const { 
    chainId,
    connect,
  } = useConfigContext();

  const isWalletConnected = accountAddress !== undefined;

  const chain = extractChain({
    chains: chains,
    id: chainId,
  });

  const placeholderSubmitButton = (
    <Button type="button" disabled variant="secondary" size="lgRounded">
      {transactionSubmitButtonText}
    </Button>
  );

  if (!isWalletConnected) {
    return (
      <>
        <Button type="button" onClick={connect} size="lgRounded">
          Connect wallet
        </Button>
        {placeholderSubmitButton}
      </>
    );
  }

  if (isWrongWalletChain) {
    return (
      <>
        <Button type="button" onClick={switchChain} size="lgRounded">
          {getSwitchChainButtonLabel(chainId)}
        </Button>
        {placeholderSubmitButton}
      </>
    );
  }

  if (approvalProps?.isApproving) {
    const { allowance, decimals } = approvalProps;

    return (
      <>
        {allowance !== undefined && decimals !== undefined && (
          <ApprovalText
            state="pending"
            allowance={allowance}
            decimals={decimals}
          />
        )}
        {placeholderSubmitButton}
      </>
    );
  }

  if (approvalProps?.needsApproval) {
    const { allowance } = approvalProps;

    const hasApproval = allowance === undefined ? false : allowance > 0n;

    if (approvalProps?.needsRevokeBeforeApproval) {
      return (
        <>
          <Button type="submit" disabled={isSubmitDisabled} size="lgRounded">
            Revoke Approval
          </Button>
          <Button type="button" disabled variant="secondary" size="lgRounded">
            Approve
          </Button>
        </>
      );
    }

    return (
      <>
        <Button type="submit" disabled={isSubmitDisabled} size="lgRounded">
          {hasApproval ? 'Update Approval' : 'Approve'}
        </Button>
        {placeholderSubmitButton}
      </>
    );
  }

  return (
    <>
      {approvalProps ? (
        <ApprovalText
          state="approved"
          allowance={approvalProps.allowance || 0n}
          decimals={approvalProps.decimals || 0}
        />
      ) : (
        <div className="flex flex-col items-center mb-2">
          <div className="font-medium text-lg">Wallet connected</div>
          <div className="text-muted-foreground text-xs">
            Chain: {chain.name}
          </div>
        </div>
      )}
      <Button
        type="submit"
        disabled={isSubmitDisabled || isLoading}
        size="lgRounded"
        className={cn({
          'col-start-2': !approvalProps,
          'gap-2': isLoading,
        })}
      >
        {isLoading && <Loader2Icon className="w-6 h-6 animate-spin" />}
        {transactionSubmitButtonText}
      </Button>
    </>
  );
};
