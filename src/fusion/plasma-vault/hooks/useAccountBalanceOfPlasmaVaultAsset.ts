import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useWallet } from '@/wallet/context';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { keepPreviousData } from '@tanstack/react-query';
import { usePlasmaVaultAssetAddress } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetAddress';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';

export const useAccountBalanceOfPlasmaVaultAsset = () => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();
  const { accountAddress } = useWallet();
  const assetAddress = usePlasmaVaultAssetAddress({ plasmaVaultAddress });

  const { data } = useReadContract({
    chainId,
    address: assetAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [accountAddress!],
    query: {
      enabled: Boolean(accountAddress) && Boolean(assetAddress),
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
