import { useContractWriteTransaction } from '@/app/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { type ChainId } from '@/app/wagmi';
import { type Address } from 'viem';
import { z } from 'zod';
import { AddressTypeSchema } from '@/utils/schema';

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
  return useContractWriteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { amount, beneficiary } = payloadSchema.parse(payload);

      return await sendAppTransaction({
        config,
        parameters: {
          address: fusionVaultAddress,
          abi: plasmaVaultAbi,
          functionName: 'withdraw',
          args: [amount, beneficiary, beneficiary],
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
  beneficiary: AddressTypeSchema,
});
