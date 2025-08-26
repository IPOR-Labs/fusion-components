import { keepPreviousData } from '@tanstack/react-query';
import { type ChainId } from '@/wagmi';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';

interface Args {
  tokenAddress: Address;
  spender: Address;
  chainId: ChainId;
}

export const useRevokeTokenAllowance = ({
  tokenAddress,
  spender,
  chainId,
}: Args) => {
  const accountAddress = useWalletAccountAddress();

  const { data: allowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    args: [accountAddress!, spender],
    functionName: 'allowance',
    chainId,
    query: {
      enabled: Boolean(accountAddress),
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return allowance;
};
