import { keepPreviousData } from '@tanstack/react-query';
import { accessManagerAbi } from '@/abi/access-manager.abi';
import { useAccessManagerAddress } from '@/fusion/access-manager/hooks/use-access-manager-address';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { type Address } from 'viem';
import { useReadContract } from 'wagmi';
import { useConfigContext } from "@/app/config/config.context";

interface Args {
  accountAddress: Address | undefined;
  role: bigint | undefined;
}

export const useHasRole = ({ accountAddress, role }: Args) => {
  const {
    chainId,
  } = useConfigContext();

  const { data: accessManagerAddress } = useAccessManagerAddress();

  return useReadContract({
    chainId,
    address: accessManagerAddress,
    abi: accessManagerAbi,
    functionName: 'hasRole',
    args: [role!, accountAddress!],
    query: {
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
      enabled:
        Boolean(accessManagerAddress) &&
        Boolean(accountAddress) &&
        Boolean(role),
    },
  });
};
