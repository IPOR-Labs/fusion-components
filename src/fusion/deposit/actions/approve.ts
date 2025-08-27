import { getErc20AbiByAddress } from '@/abi/getErc20abi';
import { useContractWriteTransaction } from '@/app/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/send-app-transaction';
import { z } from 'zod';
import { addressSchema } from '@/lib/schema';
import { type ChainId } from '@/app/config/wagmi';

interface Args {
  chainId: ChainId;
  transactionStateHandlers: TransactionStateHandlers;
}

export const usePlasmaVaultApprove = ({
  transactionStateHandlers,
  chainId,
}: Args) => {
  return useContractWriteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { fusionVaultAddress, amount, assetAddress } = payloadSchema.parse(payload);

      return await sendAppTransaction({
        config,
        parameters: {
          address: assetAddress!,
          abi: getErc20AbiByAddress(assetAddress),
          functionName: 'approve',
          args: [fusionVaultAddress, amount],
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
  fusionVaultAddress: addressSchema,
  assetAddress: addressSchema,
  amount: z.bigint(),
});
