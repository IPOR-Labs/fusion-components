import { keepPreviousData } from '@tanstack/react-query';
import { type ChainId } from '@/app/wagmi';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useWallet } from '@/wallet/context';

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
  const { accountAddress } = useWallet();

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
