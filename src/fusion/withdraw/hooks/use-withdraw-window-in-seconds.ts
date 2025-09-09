import { useReadContract } from 'wagmi';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { useWithdrawManagerAddress } from './use-withdraw-manager-address';
import { useConfigContext } from "@/app/config/config.context";

export const useWithdrawWindowInSeconds = () => {
  const {
    chainId,
  } = useConfigContext();
  const withdrawManagerAddress = useWithdrawManagerAddress();

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
