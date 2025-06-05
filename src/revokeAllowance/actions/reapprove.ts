import { useContractWriteTransaction } from '@/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/transactions/types';
import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { type Address, erc20Abi, parseEventLogs } from 'viem';
import { type ChainId } from '@/app/wagmi';
import { getTokenAbi } from '../utils/getTokenAbi';

interface Args {
  chainId: ChainId;
  spender: Address;
  amount: bigint;
  tokenAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
  onUpateAllowance: (newAllowance: bigint) => void;
}

export const useReapprove = ({
  spender,
  tokenAddress,
  amount,
  transactionStateHandlers,
  chainId,
  onUpateAllowance,
}: Args) => {
  return useContractWriteTransaction({
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
    transactionKey: `reapprove`,
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
  });
};
