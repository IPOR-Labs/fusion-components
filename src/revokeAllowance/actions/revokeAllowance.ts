import { useContractWriteTransaction } from '@/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/transactions/types';
import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { type Address, erc20Abi, parseEventLogs } from 'viem';
import { type ChainId } from '@/app/wagmi';
import { getTokenAbi } from '../utils/getTokenAbi';

interface Args {
  transactionStateHandlers: TransactionStateHandlers;
  isReady: boolean;
  chainId: ChainId;
  spender: Address;
  tokenAddress: Address;
  onUpateAllowance: (newAllowance: bigint) => void;
}

export const useRevokeAllowance = ({
  transactionStateHandlers,
  isReady,
  chainId,
  spender,
  tokenAddress,
  onUpateAllowance,
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
    transactionKey: 'revokeAllowance',
    transactionStateHandlers,
    chainId,
    onReceipt: (receipt) => {
      const logs = parseEventLogs({
        abi: erc20Abi,
        eventName: 'Approval',
        logs: receipt.logs,
      });
      const event = logs[0];
      if (event) {
        const newAllowance = event.args.value;
        onUpateAllowance(newAllowance);
      }
    },
    enabled: isReady,
  });
};
