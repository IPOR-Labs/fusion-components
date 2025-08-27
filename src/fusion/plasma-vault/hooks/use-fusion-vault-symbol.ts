import { useConfigContext } from "@/app/config/config.context";
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export const useFusionVaultSymbol = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();

  const { data } = useReadContract({
    address: fusionVaultAddress,
    abi: erc20Abi,
    functionName: 'symbol',
    args: [],
    chainId,
    query: {
      staleTime: Infinity,
    },
  });

  return data;
};
