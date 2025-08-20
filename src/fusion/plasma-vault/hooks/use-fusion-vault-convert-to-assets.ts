import { keepPreviousData } from '@tanstack/react-query';
import { useAppContext } from '@/app.context';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';

interface Args {
  shares: bigint | undefined;
}

export const useFusionVaultConvertToAssets = ({ shares }: Args) => {
  const {
    chainId,
    fusionVaultAddress,
  } = useAppContext();

  const { data } = useReadContract({
    address: fusionVaultAddress,
    abi: erc4626Abi,
    functionName: 'convertToAssets',
    args: [shares!],
    chainId,
    query: {
      enabled: shares !== undefined,
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
