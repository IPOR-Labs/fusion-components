import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import type { TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { z } from 'zod';
import { useConfigContext } from '@/app/config/config.context';

interface Args {
  transactionStateHandlers: TransactionStateHandlers;
}

export const useRedeem = ({
  transactionStateHandlers,
}: Args) => {
  const {
    fusionVaultAddress,
  } = useConfigContext();

  return useExecuteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { shares } = payloadSchema.parse(payload);

      return await sendAppTransaction({
        config,
        parameters: {
          address: fusionVaultAddress,
          abi: plasmaVaultAbi,
          functionName: 'redeem',
          args: [shares, accountAddress, accountAddress],
          account: accountAddress,
        },
      });
    },
    transactionStateHandlers,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  shares: z.bigint().positive(),
});


