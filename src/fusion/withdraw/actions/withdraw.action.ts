import { useContractWriteTransaction } from '@/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/transactions/types';
import { useWalletChainAddress } from '@/wallet/hooks';
import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { type ChainId } from '@/app/wagmi';
import { type Address } from 'viem';
import { z } from 'zod';

interface Args {
  chainId: ChainId;
  plasmaVaultAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
}

export const usePlasmaVaultWithdraw = ({
  chainId,
  plasmaVaultAddress,
  transactionStateHandlers,
}: Args) => {
  const beneficiary = useWalletChainAddress(chainId);

  const enabled = Boolean(beneficiary);

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
          functionName: 'withdraw',
          args: [amount, beneficiary, beneficiary],
          account: accountAddress,
        },
      });
    },
    transactionKey: 'plasmaVaultWithdraw',
    transactionStateHandlers,
    chainId,
    enabled,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  amount: z.bigint(),
});
