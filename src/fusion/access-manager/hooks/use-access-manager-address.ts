import { keepPreviousData } from '@tanstack/react-query';
import { plasmaVaultAbi } from '@/abi/plasma-vault-abi.abi';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { useReadContract } from 'wagmi';

export const useAccessManagerAddress = () => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();

  const result = useReadContract({
    chainId,
    address: plasmaVaultAddress,
    abi: plasmaVaultAbi,
    functionName: 'getAccessManagerAddress',
    query: {
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return result;
};
