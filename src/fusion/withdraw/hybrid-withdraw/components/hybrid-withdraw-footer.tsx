import {
  useIsSubmitDisabled,
  useSubmitButtonLabel,
} from '../hybrid-withdraw.hooks';
import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import { TransactionFormButtons } from '@/components/transaction-form-buttons';
import { useConfigContext } from '@/app/config/config.context';

export const HybridWithdrawFooter = () => {
  const {
    params: {
      accountAddress,
      isWrongWalletChain,
      switchChain,
    },
    txState,
  } = useHybridWithdrawContext();
  const {
    chainId,
    connect,
  } = useConfigContext();
  const isSubmitDisabled = useIsSubmitDisabled();
  const submitButtonLabel = useSubmitButtonLabel();
  const isPending = txState.txStatus.type === 'pending';

  return (
    <TransactionFormButtons
      isWalletConnected={Boolean(accountAddress)}
      isSubmitDisabled={isSubmitDisabled}
      transactionSubmitButtonText={submitButtonLabel}
      isWrongWalletChain={isWrongWalletChain}
      isLoading={isPending}
      chainId={chainId}
      selectWallet={connect}
      switchChain={switchChain}
    />
  );
};
