import { sendAppTransaction } from '@/transactions/send-app-transaction';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { type Address } from 'viem';
import { useAccountSharesInPlasmaVault } from '@/fusion/plasma-vault/hooks/useAccountSharesInPlasmaVault';
import { useContractWriteTransaction } from '@/transactions/use-contract-write-transaction';
import { useWalletChainAddress } from '@/wallet/hooks';
import type { ChainId } from '@/app/wagmi';
import type { TransactionStateHandlers } from '@/transactions/types';

interface Args {
  chainId: ChainId;
  plasmaVaultAddress: Address;
  transactionStateHandlers: TransactionStateHandlers;
}

export const usePlasmaVaultMaxRedeem = ({
  chainId,
  plasmaVaultAddress,
  transactionStateHandlers,
}: Args) => {
  const beneficiary = useWalletChainAddress(chainId);
  const shares = useAccountSharesInPlasmaVault();

  const enabled = Boolean(beneficiary) && Boolean(shares);

  return useContractWriteTransaction({
    writeAsync: async ({ accountAddress, ...config }) => {
      if (!beneficiary) {
        throw new Error('beneficiary is undefined');
      }

      return await sendAppTransaction({
        config,
        parameters: {
          address: plasmaVaultAddress,
          abi: plasmaVaultAbi,
          functionName: 'redeem',
          args: [shares, beneficiary, beneficiary],
          account: accountAddress,
        },
      });
    },
    transactionKey: 'plasmaVaultMaxRedeem',
    transactionStateHandlers,
    chainId,
    enabled,
  });
};
