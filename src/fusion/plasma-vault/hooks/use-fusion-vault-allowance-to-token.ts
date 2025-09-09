import { keepPreviousData } from '@tanstack/react-query';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useConfigContext } from "@/app/config/config.context";
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';

interface Args {
  tokenAddress: Address | undefined;
  enabled?: boolean;
}

export const useFusionVaultAllowanceToToken = ({
  tokenAddress,
  enabled = true,
}: Args) => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();
  const accountAddress = useWalletAccountAddress();

  const { data } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    args: [accountAddress!, fusionVaultAddress],
    functionName: 'allowance',
    chainId,
    query: {
      enabled: Boolean(accountAddress) && Boolean(tokenAddress) && enabled,
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
