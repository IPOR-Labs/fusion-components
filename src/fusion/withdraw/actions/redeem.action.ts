import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { type ChainId } from '@/app/config/wagmi';
import type { TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { z } from 'zod';
import type { Address } from 'viem';

interface Args {
  chainId: ChainId;
  fusionVaultAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useRedeem = ({
  chainId,
  fusionVaultAddress,
  transactionStateHandlers,
}: Args) => {
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
    chainId,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  shares: z.bigint().positive(),
});


