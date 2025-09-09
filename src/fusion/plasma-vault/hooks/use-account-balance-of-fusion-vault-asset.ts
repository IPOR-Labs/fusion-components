import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useConfigContext } from "@/app/config/config.context";
import { BLOCK_INTERVAL } from '@/lib/constants';
import { keepPreviousData } from '@tanstack/react-query';
import { useFusionVaultAssetAddress } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address';
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';

export const useAccountBalanceOfFusionVaultAsset = () => {
  const {
    chainId,
  } = useConfigContext();
  const accountAddress = useWalletAccountAddress();
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
