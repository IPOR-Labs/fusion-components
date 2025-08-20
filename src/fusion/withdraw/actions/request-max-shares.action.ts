import { useContractWriteTransaction } from '@/app/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/app/transactions/transactions.types';
import { sendAppTransaction } from '@/app/transactions/send-app-transaction';
import { type ChainId } from '@/wagmi';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { type Address } from 'viem';
import { isNonZeroAddress } from '@/lib/is-non-zero-address';
import { useAccountSharesInFusionVault } from '@/fusion/plasma-vault/hooks/use-account-shares-in-fusion-vault';

interface Args {
  chainId: ChainId;
  withdrawManagerAddress: Address | undefined;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useRequestMaxShares = ({
  chainId,
  withdrawManagerAddress,
  transactionStateHandlers,
}: Args) => {
  const shares = useAccountSharesInFusionVault();

  const enabled = Boolean(shares);

  return useContractWriteTransaction({
    writeAsync: async (config) => {
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
    transactionStateHandlers,
    chainId,
    enabled: enabled && isNonZeroAddress(withdrawManagerAddress),
  });
};
