import { keepPreviousData } from '@tanstack/react-query';
import { useConfigContext } from "@/app/config/config.context";
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';

export const useFusionVaultMaxDeposit = () => {
  const { chainId, fusionVaultAddress } = useConfigContext();
  const accountAddress = useWalletAccountAddress();

  return useReadContract({
    address: fusionVaultAddress,
    abi: erc4626Abi,
    functionName: 'maxDeposit',
    chainId,
    args: [accountAddress!],
    query: {
      enabled: Boolean(accountAddress),
      placeholderData: keepPreviousData,
    },
  });
};
