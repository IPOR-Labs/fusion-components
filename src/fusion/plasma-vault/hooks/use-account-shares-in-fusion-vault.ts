import { keepPreviousData } from '@tanstack/react-query';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useAppContext } from '@/app/app.context';

export const useAccountSharesInFusionVault = () => {
  const {
    walletClient,
    chainId,
    fusionVaultAddress,
  } = useAppContext();
  const accountAddress = walletClient?.account?.address;

  const { data } = useReadContract({
    address: fusionVaultAddress,
    abi: erc4626Abi,
    functionName: 'balanceOf',
    args: [accountAddress!],
    chainId,
    query: {
      enabled: Boolean(accountAddress),
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
