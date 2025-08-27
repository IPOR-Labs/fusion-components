import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { useConfigContext } from "@/app/config/config.context";
import { useReadContract } from 'wagmi';

export const useFusionVaultName = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();

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
