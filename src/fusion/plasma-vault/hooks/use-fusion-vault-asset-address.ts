import { useConfigContext } from "@/app/config/config.context";
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';

export const useFusionVaultAssetAddress = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();

  const { data } = useReadContract({
    chainId,
    address: fusionVaultAddress,
    abi: erc4626Abi,
    functionName: 'asset',
    query: {
      staleTime: Infinity,
    },
  });

  return data;
};
