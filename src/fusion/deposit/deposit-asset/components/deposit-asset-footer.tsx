import { parseUnits } from 'viem';
import { useDepositAssetContext } from '../deposit-asset.context';
import { calcNeedsApproval } from '@/app/allowance/utils/calc-needs-approval';
import { useIsSubmitDisabled, useNeedsRevokeBeforeApproval } from '../deposit-asset.hooks';
import { TransactionFormButtons } from '@/components/transaction-form-buttons';
import { useConfigContext } from '@/app/config/config.context';

export const DepositAssetFooter = () => {
  const { 
    chainId,
    connect,
  } = useConfigContext();
  const {
    params: {
      accountAddress,
      allowance,
      isWrongWalletChain,
      assetDecimals,
      isWhitelisted,
      switchChain,
      assetAddress,
      assetSymbol,
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

  const needsRevokeBeforeApproval = useNeedsRevokeBeforeApproval();

  if (assetAddress === undefined) return null;
  if (assetSymbol === undefined) return null;

  return (
    <div className="space-y-4">
      {isWhitelisted === false && (
        <p className="text-muted-foreground text-center">
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
          needsRevokeBeforeApproval,
          assetAddress,
          assetSymbol,
        }}
      />
    </div>
  );
};
