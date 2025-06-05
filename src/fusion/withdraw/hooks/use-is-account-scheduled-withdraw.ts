import { useAccountWithdrawRequestInfo } from './use-account-withdraw-request-info';
import { type Address } from 'viem';

interface Args {
  accountAddress: Address | undefined;
  plasmaVaultAddress: Address | undefined;
}

export const useIsAccountScheduledWithdraw = ({
  accountAddress,
  plasmaVaultAddress,
}: Args) => {
  const requestInfo = useAccountWithdrawRequestInfo({
    accountAddress,
    plasmaVaultAddress,
  });
  return requestInfo?.shares !== undefined && requestInfo.shares > 0n;
};
