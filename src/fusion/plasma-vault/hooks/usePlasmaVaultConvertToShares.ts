import { keepPreviousData } from '@tanstack/react-query';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';

interface Args {
  assets: bigint | undefined;
}

export const usePlasmaVaultConvertToShares = ({ assets }: Args) => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();

  const { data } = useReadContract({
    address: plasmaVaultAddress,
    abi: erc4626Abi,
    functionName: 'convertToShares',
    args: [assets!],
    chainId,
    query: {
      enabled: assets !== undefined && assets > 0n,
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
