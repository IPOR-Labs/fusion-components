import { keepPreviousData } from '@tanstack/react-query';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { useWallet } from '@/wallet/context';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';

export const useAccountSharesInPlasmaVault = () => {
  const {
    params: { plasmaVaultAddress, chainId },
  } = usePlasmaVault();
  const { accountAddress } = useWallet();

  const { data } = useReadContract({
    address: plasmaVaultAddress,
    abi: erc4626Abi,
    functionName: 'balanceOf',
    args: [accountAddress!],
    chainId,
    query: {
      enabled: Boolean(accountAddress),
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
