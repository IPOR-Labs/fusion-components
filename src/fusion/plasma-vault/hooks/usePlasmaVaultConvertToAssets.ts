import { keepPreviousData } from '@tanstack/react-query';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';

interface Args {
  shares: bigint | undefined;
}

export const usePlasmaVaultConvertToAssets = ({ shares }: Args) => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();

  const { data } = useReadContract({
    address: plasmaVaultAddress,
    abi: erc4626Abi,
    functionName: 'convertToAssets',
    args: [shares!],
    chainId,
    query: {
      enabled: shares !== undefined,
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
