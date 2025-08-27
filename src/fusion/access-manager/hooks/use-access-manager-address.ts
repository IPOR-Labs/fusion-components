import { keepPreviousData } from '@tanstack/react-query';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { useReadContract } from 'wagmi';
import { useConfigContext } from "@/app/config/config.context";

export const useAccessManagerAddress = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();

  const result = useReadContract({
    chainId,
    address: fusionVaultAddress,
    abi: plasmaVaultAbi,
    functionName: 'getAccessManagerAddress',
    query: {
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return result;
};
