import { useIsWrongWalletChain, useWalletChainAddress } from '@/wallet/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { usePublicClient, useWriteContract } from 'wagmi';
import { type Hex } from 'viem';
import { useIsSafeWallet } from '@/wallet/hooks/useIsSafeWallet';
import { useTransactions } from '@/transactions/context';
import { type ChainId } from '@/app/wagmi';
import { useChainlinkAssetUsdPrice } from '@/utils/useChainlinkFeed';

interface Args {
  chainId: ChainId;
}

export const useSetup = ({ chainId }: Args) => {
  const publicClient = usePublicClient({ chainId });
  const accountAddress = useWalletChainAddress(chainId);
  const isWrongWalletChain = useIsWrongWalletChain(chainId);
  const ethPrice = useChainlinkAssetUsdPrice({
    assetType: 'ETH',
    enabled: true,
  });
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const isSafeWallet = useIsSafeWallet();

  const { addTransaction, updateTransaction } = useTransactions();

  return {
    publicClient,
    accountAddress,
    isWrongWalletChain,
    ethPrice,
    queryClient,
    addTransaction,
    updateTransaction,
    getReceipt: async (hash: Hex) => {
      if (publicClient === undefined) {
        throw new Error('publicClient is undefined');
      }

      return await publicClient.waitForTransactionReceipt({
        hash,
      });
    },
    getTransaction: async (hash: Hex) => {
      if (publicClient === undefined) {
        throw new Error('publicClient is undefined');
      }

      return await publicClient.getTransaction({
        hash,
      });
    },
    writeContractAsync,
    isSafeWallet,
  };
};
