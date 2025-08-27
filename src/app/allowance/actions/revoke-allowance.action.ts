import { useContractWriteTransaction } from '@/app/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/send-app-transaction';
import { type Address } from 'viem';
import { type ChainId } from '@/app/config/wagmi';
import { getTokenAbi } from '../utils/get-token-abi';

interface Args {
  transactionStateHandlers: TransactionStateHandlers;
  isReady: boolean;
  chainId: ChainId;
  spender: Address;
  tokenAddress: Address;
}

export const useRevokeAllowance = ({
  transactionStateHandlers,
  isReady,
  chainId,
  spender,
  tokenAddress,
}: Args) => {
  return useContractWriteTransaction({
    writeAsync: async (config) => {
      return await sendAppTransaction({
        config,
        parameters: {
          address: tokenAddress,
          abi: getTokenAbi(tokenAddress),
          functionName: 'approve',
          args: [spender, 0n],
          account: config.accountAddress,
        },
      });
    },
    transactionStateHandlers,
    chainId,
    enabled: isReady,
  });
};
