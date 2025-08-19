import { keepPreviousData } from '@tanstack/react-query';
import { useAppContext } from '@/app/app.context';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';

export const useFusionVaultMaxDeposit = () => {
  const { walletClient, chainId, fusionVaultAddress } = useAppContext();
  const accountAddress = walletClient?.account?.address;

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
