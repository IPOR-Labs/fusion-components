import { useWithdrawManagerAddress } from '@/fusion/withdraw/hooks/use-withdraw-manager-address';
import { isNonZeroAddress } from '@/lib/is-non-zero-address';

export const useIsScheduledWithdrawal = () => {
  const withdrawManagerAddress = useWithdrawManagerAddress();

  if (withdrawManagerAddress === undefined) {
    return undefined;
  }

  return isNonZeroAddress(withdrawManagerAddress);
};
