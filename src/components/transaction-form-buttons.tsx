import { extractChain, type Address } from 'viem';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { getSwitchChainButtonLabel } from '@/app/wallet/utils/get-switch-chain-button-label';
import { chains, type ChainId } from '@/wagmi';
import { cn } from '@/lib/utils';
import { ApprovalSteps } from '@/components/approval-steps';
import { ApprovalText } from '@/components/approval-text';
import styles from './transaction-form-buttons.module.css';

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
    <div className={styles.container}>
      <div className={styles.approvalStepsContainer}>
        <ApprovalSteps
          needsApproval={
            props.approvalProps?.needsApproval ||
            props.isWrongWalletChain ||
            !props.isWalletConnected
          }
          isApproving={props.approvalProps?.isApproving || false}
        />
      </div>
      <div className={styles.buttonsGrid}>
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
        <Button type="button" onClick={selectWallet} variant="primary">
          Connect wallet
        </Button>
        {placeholderSubmitButton}
      </>
    );
  }

  if (isWrongWalletChain) {
    return (
      <>
        <Button type="button" onClick={switchChain} variant="primary">
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
        <Button type="submit" disabled={isSubmitDisabled} variant="primary">
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
        <div className={styles.walletConnectedContainer}>
          <div className={styles.walletConnectedText}>Wallet connected</div>
          <div className={styles.chainText}>
            Chain: {chain.name}
          </div>
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitDisabled || isLoading}
        className={cn({
          [styles.submitButton]: !approvalProps,
          [styles.submitButtonLoading]: isLoading,
        })}
      >
        {isLoading && <Loader2Icon className={styles.loaderIcon} />}
        {transactionSubmitButtonText}
      </Button>
    </>
  );
};
