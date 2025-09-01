import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { z } from 'zod';
import { addressSchema } from '@/lib/schema';
import { type ChainId } from '@/app/config/wagmi';
import { getErc20Abi } from '@/abi/get-erc20-abi';

interface Args {
  chainId: ChainId;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useApprove = ({
  transactionStateHandlers,
  chainId,
}: Args) => {
  return useExecuteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { spender, amount, assetAddress } = payloadSchema.parse(payload);

      return await sendAppTransaction({
        config,
        parameters: {
          address: assetAddress,
          abi: getErc20Abi(assetAddress),
          functionName: 'approve',
          args: [spender, amount],
          account: accountAddress,
        },
      });
    },
    transactionStateHandlers,
    chainId,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  spender: addressSchema,
  assetAddress: addressSchema,
  amount: z.bigint(),
});
