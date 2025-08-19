import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useAppContext } from '@/app/app.context';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { keepPreviousData } from '@tanstack/react-query';
import { useFusionVaultAssetAddress } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address';

export const useAccountBalanceOfFusionVaultAsset = () => {
  const {
    walletClient,
    chainId,
  } = useAppContext();
  const accountAddress = walletClient?.account?.address;
  const assetAddress = useFusionVaultAssetAddress();

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
