import { parseUnits } from 'viem';
import { useDepositAssetContext } from '../deposit-asset.context';
import { calcNeedsApproval } from '@/app/allowance/utils/calc-needs-approval';
import { useIsSubmitDisabled } from '../deposit-asset.hooks';
import { TransactionFormButtons } from '@/components/transaction-form-buttons';
import styles from './deposit-asset-footer.module.css';

export const DepositAssetFooter = () => {
  const {
    params: {
      accountAddress,
      allowance,
      chainId,
      isWrongWalletChain,
      assetDecimals,
      canDeposit,
      connect,
      switchChain,
    },
    form,
    approveTxState,
    depositTxState,
  } = useDepositAssetContext();

  const isApproving = approveTxState.txStatus.type === 'pending';
  const isPending = depositTxState.txStatus.type === 'pending';

  const amountString = form.watch('amount');
  const isSubmitDisabled = useIsSubmitDisabled();

  const amount = assetDecimals ? parseUnits(amountString, assetDecimals) : 0n;

  const needsApproval = calcNeedsApproval({
    allowance,
    amount,
  });

  return (
    <div className={styles.root}>
      {canDeposit === false && (
        <p className={styles.message}>
          You are not whitelisted
        </p>
      )}
      <TransactionFormButtons
        isWalletConnected={Boolean(accountAddress)}
        isSubmitDisabled={isSubmitDisabled}
        transactionSubmitButtonText="Deposit"
        isWrongWalletChain={isWrongWalletChain}
        chainId={chainId}
        selectWallet={connect}
        switchChain={switchChain}
        isLoading={isPending}
        approvalProps={{
          accountAddress: accountAddress,
          decimals: assetDecimals,
          visibleDecimals: assetDecimals,
          allowance,
          needsApproval,
          isApproving,
        }}
      />
    </div>
  );
};
