import {
  useIsSubmitDisabled,
  useSubmitButtonLabel,
} from '../hybrid-withdraw.hooks';
import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import { TransactionFormButtons } from '@/components/TransactionFormButtons';

export const HybridWithdrawFooter = () => {
  const {
    params: {
      accountAddress,
      chainId,
      isWrongWalletChain,
      isPending,
      selectWallet,
      switchChain,
    },
  } = useHybridWithdrawContext();
  const isSubmitDisabled = useIsSubmitDisabled();
  const submitButtonLabel = useSubmitButtonLabel();

  return (
    <TransactionFormButtons
      isWalletConnected={Boolean(accountAddress)}
      isSubmitDisabled={isSubmitDisabled}
      transactionSubmitButtonText={submitButtonLabel}
      isWrongWalletChain={isWrongWalletChain}
      isLoading={isPending}
      chainId={chainId}
      selectWallet={selectWallet}
      switchChain={switchChain}
    />
  );
};
