import { usePlasmaVaultAssetAddress } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetAddress';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export const usePlasmaVaultAssetSymbol = () => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();
  const assetAddress = usePlasmaVaultAssetAddress({
    plasmaVaultAddress,
  });

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
