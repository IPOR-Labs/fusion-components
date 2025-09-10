import { z } from 'zod';
import { useConfigContext } from '@/app/config/config.context';
import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import type { TransactionStateHandlers } from '@/app/transactions/transactions.types';

export interface Args {
  transactionStateHandlers: TransactionStateHandlers;
}

export const useRedeemFromRequest = ({
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
          functionName: 'redeemFromRequest',
          args: [shares, accountAddress, accountAddress],
          account: accountAddress,
        },
      });
    },
    transactionStateHandlers,
    payloadSchema,
  });
};

export const payloadSchema = z.object({
  shares: z.bigint(),
});
