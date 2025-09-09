import { keepPreviousData } from '@tanstack/react-query';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useConfigContext } from "@/app/config/config.context";
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';

export const useAccountSharesInFusionVault = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();
  const accountAddress = useWalletAccountAddress();

  const { data } = useReadContract({
    address: fusionVaultAddress,
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
