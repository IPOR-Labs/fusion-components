import { useFusionVaultAssetAddress } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address';
import { useAppContext } from '@/app.context';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export const useFusionVaultAssetSymbol = () => {
  const {
    chainId,
  } = useAppContext();
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
