import { useContractWriteTransaction } from '@/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/transactions/types';
import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault-abi.abi';
import type { ChainId } from '@/app/wagmi';
import type { Address } from 'viem';
import { z } from 'zod';
import { useAccount } from 'wagmi';

interface Args {
  chainId: ChainId;
  plasmaVaultAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
}

export const usePlasmaVaultDeposit = ({
  chainId,
  plasmaVaultAddress,
  transactionStateHandlers,
}: Args) => {
  const { address: beneficiary } = useAccount();

  return useContractWriteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { amount } = payloadSchema.parse(payload);

      if (!beneficiary) {
        throw new Error('beneficiary is undefined');
      }

      return await sendAppTransaction({
        config,
        parameters: {
          address: plasmaVaultAddress,
          abi: plasmaVaultAbi,
          functionName: 'deposit',
          args: [amount, beneficiary],
          account: accountAddress,
        },
      });
    },
    transactionKey: 'plasmaVaultDeposit',
    transactionStateHandlers,
    chainId,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  amount: z.bigint(),
});
