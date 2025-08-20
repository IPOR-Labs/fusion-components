import { keepPreviousData } from '@tanstack/react-query';
import { useAppContext } from '@/app.context';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';

interface Args {
  assets: bigint | undefined;
}

export const useFusionVaultConvertToShares = ({ assets }: Args) => {
  const {
    chainId,
    fusionVaultAddress,
  } = useAppContext();

  const { data } = useReadContract({
    address: fusionVaultAddress,
    abi: erc4626Abi,
    functionName: 'convertToShares',
    args: [assets!],
    chainId,
    query: {
      enabled: assets !== undefined && assets > 0n,
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
