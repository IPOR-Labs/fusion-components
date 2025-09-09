import { useFusionVaultAssetAddress } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address';
import { useConfigContext } from "@/app/config/config.context";
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export const useFusionVaultAssetSymbol = () => {
  const {
    chainId,
  } = useConfigContext();
  const assetAddress = useFusionVaultAssetAddress();

  const { data } = useReadContract({
    chainId,
    address: assetAddress,
    abi: erc20Abi,
    functionName: 'symbol',
    query: {
      staleTime: Infinity,
      enabled: Boolean(assetAddress),
    },
  });

  return data;
};
