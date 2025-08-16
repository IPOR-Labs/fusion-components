import { parseUnits } from 'viem';
import { useDepositAssetContext } from '../deposit-asset.context';
import { calcNeedsApproval } from '@/utils/calc-needs-approval';
import { useIsSubmitDisabled } from '../deposit-asset.hooks';
import { TransactionFormButtons } from '@/components/TransactionFormButtons';

export const DepositAssetFooter = () => {
  const {
    params: {
      accountAddress,
      isApproving,
      allowance,
      chainId,
      isWrongWalletChain,
      assetDecimals,
      canDeposit,
      selectWallet,
      switchChain,
      isPending,
    },
    form,
  } = useDepositAssetContext();

  const amountString = form.watch('amount');
  const isSubmitDisabled = useIsSubmitDisabled();

  const amount = assetDecimals ? parseUnits(amountString, assetDecimals) : 0n;

  const needsApproval = calcNeedsApproval({
    allowance,
    amount,
  });

  return (
    <div className="space-y-4">
      {canDeposit === false && (
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
        selectWallet={selectWallet}
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
