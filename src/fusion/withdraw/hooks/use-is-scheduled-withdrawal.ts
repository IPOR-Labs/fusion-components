import { useWithdrawManagerAddress } from '@/fusion/withdraw/hooks/use-withdraw-manager-address';
import { isNonZeroAddress } from '@/utils/isNonZeroAddress';
import { type Address } from 'viem';

interface Args {
  plasmaVaultAddress: Address | undefined;
}

export const useIsScheduledWithdrawal = ({ plasmaVaultAddress }: Args) => {
  const withdrawManagerAddress = useWithdrawManagerAddress({
    plasmaVaultAddress,
  });

  if (withdrawManagerAddress === undefined) {
    return undefined;
  }

  return isNonZeroAddress(withdrawManagerAddress);
};
