import { useActions } from './revoke-allowance.actions';
import { useParams } from './revoke-allowance.params';
import { RevokeAllowanceContext, useRevokeAllowanceContext } from './revoke-allowance.context';
import { type Address } from 'viem';
import { type ChainId } from '@/wagmi';
import { RevokeAllowanceRevoke } from './components/revoke-allowance-revoke';
import { useTransactionState } from '@/app/transactions/hooks/use-transaction-state';
import { TransactionFeedback } from '@/app/transactions/components/transaction-feedback';

interface Props {
  chainId: ChainId;
  tokenAddress: Address;
  spender: Address;
  newAllowance: bigint;
  onDone: () => void;
  onUpdateAllowance: (newAllowance: bigint) => void;
}

export const RevokeAllowance = ({
  chainId,
  tokenAddress,
  spender,
  newAllowance,
  onDone,
  onUpdateAllowance,
}: Props) => {
  const params = useParams({
    chainId,
    tokenAddress,
    spender,
    newAllowance,
    onDone,
    onUpdateAllowance,
  });
  const actions = useActions({
    params,
  });

  const revokeAllowanceTxState = useTransactionState({
    onSuccess: ({ receipt }) => {
      params.handleUpdateAllowance(receipt);
    },
  });

  const reapproveTxState = useTransactionState({
    onSuccess: ({ receipt }) => {
      params.handleUpdateAllowance(receipt);
    },
  });

  return (
    <RevokeAllowanceContext.Provider value={{
      params,
      actions,
      revokeAllowanceTxState,
      reapproveTxState,
    }}>
      <Content />
    </RevokeAllowanceContext.Provider>
  );
};

const Content = () => {
  const {
    revokeAllowanceTxState,
    reapproveTxState,
  } = useRevokeAllowanceContext();

  return (
    <>
      <RevokeAllowanceRevoke />
      <TransactionFeedback transactionState={revokeAllowanceTxState} />
      <TransactionFeedback transactionState={reapproveTxState} />
    </>
  );
};
