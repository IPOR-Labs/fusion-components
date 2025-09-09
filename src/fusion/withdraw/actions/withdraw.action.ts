import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { z } from 'zod';
import { useConfigContext } from '@/app/config/config.context';

interface Args {
  transactionStateHandlers: TransactionStateHandlers;
}

export const useWithdraw = ({
  transactionStateHandlers,
}: Args) => {
  const {
    fusionVaultAddress,
  } = useConfigContext();

  return useExecuteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { amount } = payloadSchema.parse(payload);

      return await sendAppTransaction({
        config,
        parameters: {
          address: fusionVaultAddress,
          abi: plasmaVaultAbi,
          functionName: 'withdraw',
          args: [amount, accountAddress, accountAddress],
          account: accountAddress,
        },
      });
    },
    transactionStateHandlers,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  amount: z.bigint(),
});
