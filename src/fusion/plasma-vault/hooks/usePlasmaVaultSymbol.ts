import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

export const usePlasmaVaultSymbol = () => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();

  const { data } = useReadContract({
    address: plasmaVaultAddress,
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
