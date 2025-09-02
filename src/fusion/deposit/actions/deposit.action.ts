import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { z } from 'zod';
import { addressSchema } from '@/lib/schema';

interface Args {
  transactionStateHandlers: TransactionStateHandlers;
}

export const usePlasmaVaultDeposit = ({
  transactionStateHandlers,
}: Args) => {
  return useExecuteTransaction({
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
