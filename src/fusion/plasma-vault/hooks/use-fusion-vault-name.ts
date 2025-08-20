import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { useAppContext } from '@/app.context';
import { useReadContract } from 'wagmi';

export const useFusionVaultName = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useAppContext();

  return useReadContract({
    address: fusionVaultAddress,
    abi: plasmaVaultAbi,
    functionName: 'name',
    chainId,
    query: {
      staleTime: Infinity,
    },
  });
};
