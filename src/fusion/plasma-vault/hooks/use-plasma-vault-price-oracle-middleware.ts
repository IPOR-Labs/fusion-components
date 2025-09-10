import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { useReadContract } from 'wagmi';
import { useConfigContext } from '@/app/config/config.context';

export const usePlasmaVaultPriceOracleMiddleware = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();

  const { data } = useReadContract({
    chainId,
    address: fusionVaultAddress,
    abi: plasmaVaultAbi,
    functionName: 'getPriceOracleMiddleware',
    query: {
      staleTime: Infinity,
    },
  });

  return data;
};
