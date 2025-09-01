import { useExecuteTransaction } from '@/app/transactions/hooks/use-execute-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/utils/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { type ChainId } from '@/app/config/wagmi';
import { type Address } from 'viem';
import { z } from 'zod';

interface Args {
  chainId: ChainId;
  fusionVaultAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useWithdraw = ({
  chainId,
  fusionVaultAddress,
  transactionStateHandlers,
}: Args) => {
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
    chainId,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  amount: z.bigint(),
});
