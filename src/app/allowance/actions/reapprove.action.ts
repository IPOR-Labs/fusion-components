import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { type Address } from 'viem';
import { type ChainId } from '@/app/config/wagmi';
import { getTokenAbi } from '../utils/get-token-abi';

interface Args {
  chainId: ChainId;
  spender: Address;
  amount: bigint;
  tokenAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useReapprove = ({
  spender,
  tokenAddress,
  amount,
  transactionStateHandlers,
  chainId,
}: Args) => {
  return useExecuteTransaction({
    writeAsync: async ({ accountAddress, ...config }) => {
      return await sendAppTransaction({
        config,
        parameters: {
          address: tokenAddress,
          abi: getTokenAbi(tokenAddress),
          functionName: 'approve',
          args: [spender, amount],
          account: accountAddress,
        },
      });
    },
    transactionStateHandlers,
    chainId,
  });
};
