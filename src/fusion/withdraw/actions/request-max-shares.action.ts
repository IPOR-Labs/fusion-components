import { useContractWriteTransaction } from '@/transactions/use-contract-write-transaction';
import { type TransactionStateHandlers } from '@/transactions/types';
import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { type ChainId } from '@/app/wagmi';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { type Address } from 'viem';
import { isNonZeroAddress } from '@/utils/isNonZeroAddress';
import { useAccountSharesInPlasmaVault } from '@/fusion/plasma-vault/hooks/useAccountSharesInPlasmaVault';

interface Args {
  chainId: ChainId;
  withdrawManagerAddress: Address | undefined;
  transactionStateHandlers: TransactionStateHandlers;
}

export const useWithdrawManagerRequestMaxShares = ({
  chainId,
  withdrawManagerAddress,
  transactionStateHandlers,
}: Args) => {
  const shares = useAccountSharesInPlasmaVault();

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
    transactionKey: 'withdrawManagerRequest',
    transactionStateHandlers,
    chainId,
    enabled: enabled && isNonZeroAddress(withdrawManagerAddress),
  });
};
