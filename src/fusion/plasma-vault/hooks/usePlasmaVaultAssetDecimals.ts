import { usePlasmaVaultAssetAddress } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetAddress';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

interface Params {
  plasmaVaultAddress: Address;
}

export const usePlasmaVaultAssetDecimals = ({ plasmaVaultAddress }: Params) => {
  const {
    params: { chainId },
  } = usePlasmaVault();
  const assetAddress = usePlasmaVaultAssetAddress({
    plasmaVaultAddress,
  });

  const { data } = useReadContract({
    chainId,
    address: assetAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      staleTime: Infinity,
      enabled: Boolean(assetAddress),
    },
  });

  return data;
};
