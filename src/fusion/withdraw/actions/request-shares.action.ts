import { useContractWriteTransaction } from '@/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/transactions/types';
import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { type ChainId } from '@/app/wagmi';
import { z } from 'zod';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { type Address } from 'viem';
import { isNonZeroAddress } from '@/utils/isNonZeroAddress';

interface Args {
  chainId: ChainId;
  withdrawManagerAddress: Address | undefined;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useWithdrawManagerRequestShares = ({
  chainId,
  withdrawManagerAddress,
  transactionStateHandlers,
}: Args) => {
  return useContractWriteTransaction({
    writeAsync: async (config, payload) => {
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
          account: config.accountAddress,
        },
      });
    },
    transactionKey: 'withdrawManagerRequest',
    transactionStateHandlers,
    chainId,
    enabled: isNonZeroAddress(withdrawManagerAddress),
    payloadSchema,
  });
};

const payloadSchema = z.object({
  shares: z.bigint(),
});
