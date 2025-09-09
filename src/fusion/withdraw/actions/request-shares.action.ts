import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { z } from 'zod';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { type Address } from 'viem';
import { isNonZeroAddress } from '@/lib/is-non-zero-address';

interface Args {
  withdrawManagerAddress: Address | undefined;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useRequestShares = ({
  withdrawManagerAddress,
  transactionStateHandlers,
}: Args) => {
  return useExecuteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { shares } = payloadSchema.parse(payload);

      if (!isNonZeroAddress(withdrawManagerAddress)) {
        throw new Error('withdrawManagerAddress is invalid');
      }

      return await sendAppTransaction({
        config,
        parameters: {
          address: withdrawManagerAddress,
          abi: withdrawManagerAbi,
          functionName: 'requestShares',
          args: [shares],
          account: accountAddress,
        },
      });
    },
    transactionStateHandlers,
    enabled: isNonZeroAddress(withdrawManagerAddress),
    payloadSchema,
  });
};

const payloadSchema = z.object({
  shares: z.bigint(),
});
