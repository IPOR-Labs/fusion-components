import { keepPreviousData } from '@tanstack/react-query';
import { accessManagerAbi } from '@/abi/access-manager.abi';
import { useAccessManagerAddress } from '@/fusion/access-manager/hooks/use-access-manager-address';
import {
  ACCESS_MANAGER_ROLE,
  type AccessManagerRole,
} from '@/fusion/access-manager/access-manager.types';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { type Address } from 'viem';
import { useReadContract } from 'wagmi';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';

interface Args {
  accountAddress: Address | undefined;
  role: AccessManagerRole | undefined;
}

export const useHasRole = ({ accountAddress, role }: Args) => {
  const {
    params: { chainId },
  } = usePlasmaVault();

  const roleValue =
    role !== undefined ? ACCESS_MANAGER_ROLE[role].value : undefined;

  const { data: accessManagerAddress } = useAccessManagerAddress();

  return useReadContract({
    chainId,
    address: accessManagerAddress,
    abi: accessManagerAbi,
    functionName: 'hasRole',
    args: [roleValue!, accountAddress!],
    query: {
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
      enabled:
        Boolean(accessManagerAddress) &&
        Boolean(accountAddress) &&
        Boolean(roleValue),
    },
  });
};
