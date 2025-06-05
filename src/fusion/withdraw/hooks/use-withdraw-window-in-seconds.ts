import { useReadContract } from 'wagmi';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { useWithdrawManagerAddress } from './use-withdraw-manager-address';

export const useWithdrawWindowInSeconds = () => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();
  const withdrawManagerAddress = useWithdrawManagerAddress({
    plasmaVaultAddress,
  });

  const { data: withdrawWindow } = useReadContract({
    chainId,
    address: withdrawManagerAddress,
    abi: withdrawManagerAbi,
    functionName: 'getWithdrawWindow',
    query: {
      enabled: Boolean(withdrawManagerAddress),
    },
  });

  return withdrawWindow;
};
