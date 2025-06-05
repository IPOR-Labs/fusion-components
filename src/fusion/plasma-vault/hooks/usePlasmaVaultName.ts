import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { useReadContract } from 'wagmi';
import { type Address } from 'viem';

interface Params {
  plasmaVaultAddress: Address;
}

export const usePlasmaVaultName = ({ plasmaVaultAddress }: Params) => {
  const {
    params: { chainId },
  } = usePlasmaVault();

  return useReadContract({
    address: plasmaVaultAddress,
    abi: plasmaVaultAbi,
    functionName: 'name',
    args: [],
    chainId,
    query: {
      staleTime: Infinity,
    },
  });
};
