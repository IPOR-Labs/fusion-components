import { sendAppTransaction } from '@/app/transactions/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { useAccountSharesInFusionVault } from '@/fusion/plasma-vault/hooks/use-account-shares-in-fusion-vault';
import { useContractWriteTransaction } from '@/app/transactions/use-contract-write-transaction';
import type { ChainId } from '@/app/wagmi';
import type { TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { AddressTypeSchema } from '@/utils/schema';
import { z } from 'zod';
import type { Address } from 'viem';

interface Args {
  chainId: ChainId;
  fusionVaultAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useMaxRedeem = ({
  chainId,
  fusionVaultAddress,
  transactionStateHandlers,
}: Args) => {
  const shares = useAccountSharesInFusionVault();

  const enabled = Boolean(shares);

  return useContractWriteTransaction({
    writeAsync: async ({ accountAddress, ...config }, payload) => {
      const { beneficiary } = payloadSchema.parse(payload);

      return await sendAppTransaction({
        config,
        parameters: {
          address: fusionVaultAddress,
          abi: plasmaVaultAbi,
          functionName: 'redeem',
          args: [shares, beneficiary, beneficiary],
          account: accountAddress,
        },
      });
    },
    transactionStateHandlers,
    chainId,
    enabled,
    payloadSchema,
  });
};

const payloadSchema = z.object({
  beneficiary: AddressTypeSchema,
});


