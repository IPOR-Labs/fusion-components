import { extractChain, type Address } from 'viem';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { getSwitchChainButtonLabel } from '@/app/wallet/utils/get-switch-chain-button-label';
import { chains, type ChainId } from '@/app/config/wagmi';
import { cn } from '@/lib/utils';
import { ApprovalSteps } from '@/components/approval-steps';
import { ApprovalText } from '@/components/approval-text';

type Props = {
  chainId: ChainId;
  selectWallet: (() => void) | undefined;
  switchChain: () => void;
  isSubmitDisabled: boolean;
  isWalletConnected: boolean;
  transactionSubmitButtonText: string;
  isWrongWalletChain: boolean;
  isLoading: boolean;
  approvalProps?: {
    accountAddress: Address | undefined;
    decimals: number | undefined;
    isApproving: boolean;
    needsApproval: boolean;
    allowance: bigint | undefined;
    visibleDecimals: number | undefined;
  };
};

export const TransactionFormButtons = (props: Props) => {
  return (
    <div className="space-y-4 -mx-8">
      <div className="w-1/2 mx-auto">
        <ApprovalSteps
          needsApproval={
            props.approvalProps?.needsApproval ||
            props.isWrongWalletChain ||
            !props.isWalletConnected
          }
          isApproving={props.approvalProps?.isApproving || false}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 mx-8 items-center">
        <Buttons {...props} />
      </div>
    </div>
  );
};

const Buttons = ({
  selectWallet,
  chainId,
  switchChain,
  isWrongWalletChain,
  isWalletConnected,
  transactionSubmitButtonText,
  isSubmitDisabled,
  isLoading,
  approvalProps,
}: Props) => {
  const chain = extractChain({
    chains: chains,
    id: chainId,
  });

  const placeholderSubmitButton = (
    <Button type="button" disabled variant="secondary">
      {transactionSubmitButtonText}
    </Button>
  );

  if (!isWalletConnected) {
    return (
      <>
        <Button type="button" onClick={selectWallet}>
          Connect wallet
        </Button>
        {placeholderSubmitButton}
      </>
    );
  }

  if (isWrongWalletChain) {
    return (
      <>
        <Button type="button" onClick={switchChain}>
          {getSwitchChainButtonLabel(chainId)}
        </Button>
        {placeholderSubmitButton}
      </>
    );
  }

  if (approvalProps?.isApproving) {
    const { allowance, decimals, visibleDecimals, accountAddress } =
      approvalProps;

    return (
      <>
        {allowance !== undefined && decimals !== undefined && (
          <ApprovalText
            state="pending"
            allowance={allowance}
            decimals={decimals}
            visibleDecimals={visibleDecimals}
            accountAddress={accountAddress}
          />
        )}
        {placeholderSubmitButton}
      </>
    );
  }

  if (approvalProps?.needsApproval) {
    const { allowance } = approvalProps;

    const hasApproval = allowance === undefined ? false : allowance > 0n;

    return (
      <>
        <Button type="submit" disabled={isSubmitDisabled}>
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
          visibleDecimals={approvalProps.visibleDecimals || 0}
          accountAddress={approvalProps.accountAddress}
        />
      ) : (
        <div className="flex flex-col items-center mb-2">
          <div className="text-white font-medium text-lg">Wallet connected</div>
          <div className="text-white/50 text-xs">
            Chain: {chain.name}
          </div>
        </div>
      )}
      <Button
        type="submit"
        disabled={isSubmitDisabled || isLoading}
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
