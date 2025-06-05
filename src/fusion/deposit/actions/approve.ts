import { getErc20AbiByAddress } from '@/abi/getErc20abi';
import { useContractWriteTransaction } from '@/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/transactions/types';
import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { type Address, erc20Abi, parseEventLogs } from 'viem';
import { z } from 'zod';
import { AddressTypeSchema } from '@/utils/schema';
import type { ChainId } from '@/app/wagmi';

interface Args {
  chainId: ChainId;
  plasmaVaultAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
  onUpateAllowance: (newAllowance: bigint) => void;
}

export const usePlasmaVaultApprove = ({
  plasmaVaultAddress,
  transactionStateHandlers,
  chainId,
  onUpateAllowance,
}: Args) => {
  return useContractWriteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { amount, assetAddress } = payloadSchema.parse(payload);

      return await sendAppTransaction({
        config,
        parameters: {
          address: assetAddress!,
          abi: getErc20AbiByAddress(assetAddress),
          functionName: 'approve',
          args: [plasmaVaultAddress, amount],
          account: accountAddress,
        },
      });
    },
    transactionKey: `plasmaVaultDepositApprove`,
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
    payloadSchema,
  });
};

const payloadSchema = z.object({
  assetAddress: AddressTypeSchema,
  amount: z.bigint(),
});
