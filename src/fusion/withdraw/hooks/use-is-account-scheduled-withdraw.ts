import { useAccountWithdrawRequestInfo } from './use-account-withdraw-request-info';

export const useIsAccountScheduledWithdraw = () => {
  const requestInfo = useAccountWithdrawRequestInfo();
  return requestInfo?.shares !== undefined && requestInfo.shares > 0n;
};
