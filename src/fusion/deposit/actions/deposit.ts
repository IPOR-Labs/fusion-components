import { useContractWriteTransaction } from '@/app/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import type { ChainId } from '@/wagmi';
import { z } from 'zod';
import { addressSchema } from '@/lib/schema';

interface Args {
  chainId: ChainId;
  transactionStateHandlers: TransactionStateHandlers;
}

export const usePlasmaVaultDeposit = ({
  chainId,
  transactionStateHandlers,
}: Args) => {
  return useContractWriteTransaction({
    chainId,
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { fusionVaultAddress, amount, beneficiary } = payloadSchema.parse(payload);

      return await sendAppTransaction({
        config,
        parameters: {
          address: fusionVaultAddress,
          abi: plasmaVaultAbi,
          functionName: 'deposit',
          args: [amount, beneficiary],
          account: accountAddress,
        },
      });
    },
    transactionStateHandlers,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  fusionVaultAddress: addressSchema,
  amount: z.bigint(),
  beneficiary: addressSchema,
});
