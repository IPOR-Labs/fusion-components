import { useReadContract } from 'wagmi';
import { maxUint64, toFunctionSelector } from 'viem';
import { accessManagerAbi } from '@/abi/access-manager.abi';
import { useAccessManagerAddress } from '@/fusion/access-manager/hooks/use-access-manager-address';
import { useConfigContext } from "@/app/config/config.context";

export const useIsVaultPublic = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();
  const { data: accessManagerAddress } = useAccessManagerAddress();
  const depositFunctionSelector = toFunctionSelector(
    'deposit(uint256,address)',
  );

  const { data } = useReadContract({
    chainId: chainId,
    address: accessManagerAddress,
    abi: accessManagerAbi,
    functionName: 'getTargetFunctionRole',
    args: [fusionVaultAddress, depositFunctionSelector],
    query: {
      enabled: accessManagerAddress !== undefined,
    },
  });

  return maxUint64 === data;
};
