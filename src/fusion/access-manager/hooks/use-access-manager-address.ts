import { keepPreviousData } from '@tanstack/react-query';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { useReadContract } from 'wagmi';
import { useAppContext } from '@/app/app.context';

export const useAccessManagerAddress = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useAppContext();

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
