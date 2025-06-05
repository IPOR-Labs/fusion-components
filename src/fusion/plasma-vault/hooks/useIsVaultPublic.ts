import { useReadContract } from 'wagmi';
import { maxUint64, toFunctionSelector } from 'viem';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { accessManagerAbi } from '@/abi/access-manager.abi';
import { useAccessManagerAddress } from '@/fusion/access-manager/hooks/use-access-manager-address';

export const useIsVaultPublic = () => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();
  const { data: accessManagerAddress } = useAccessManagerAddress();
  const depositFunctionSelector = toFunctionSelector(
    'deposit(uint256,address)',
  );

  const { data } = useReadContract({
    chainId: chainId,
    address: accessManagerAddress,
    abi: accessManagerAbi,
    functionName: 'getTargetFunctionRole',
    args: [plasmaVaultAddress, depositFunctionSelector],
    query: {
      enabled: accessManagerAddress !== undefined,
    },
  });

  return maxUint64 === data;
};
