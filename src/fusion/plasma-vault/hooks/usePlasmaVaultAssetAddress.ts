import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { type Address, erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';

interface Params {
  plasmaVaultAddress: Address;
  enabled?: boolean;
}

export const usePlasmaVaultAssetAddress = ({
  plasmaVaultAddress,
  enabled = true,
}: Params) => {
  const {
    params: { chainId },
  } = usePlasmaVault();

  const { data } = useReadContract({
    chainId,
    address: plasmaVaultAddress,
    abi: erc4626Abi,
    functionName: 'asset',
    query: {
      staleTime: Infinity,
      enabled,
    },
  });

  return data;
};
