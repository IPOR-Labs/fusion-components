import { useReadContract } from 'wagmi';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { isNonZeroAddress } from '@/utils/is-non-zero-address';
import { useWithdrawManagerAddress } from './use-withdraw-manager-address';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { keepPreviousData } from '@tanstack/react-query';
import { useAppContext } from '@/app/app.context';

export const useAccountWithdrawRequestInfo = () => {
  const {
    chainId,
    walletClient,
  } = useAppContext();
  const accountAddress = walletClient?.account?.address;

  const withdrawManagerAddress = useWithdrawManagerAddress();

  const { data: requestInfo, isError } = useReadContract({
    chainId,
    address: withdrawManagerAddress,
    abi: withdrawManagerAbi,
    functionName: 'requestInfo',
    args: [accountAddress!],
    query: {
      enabled:
        Boolean(accountAddress) && isNonZeroAddress(withdrawManagerAddress),
      retry: false,
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  /**
   * @dev This function reverts if there is no active request for the account
   * To avoid passing stale data, we return undefined if there is an error
   */
  if (isError) {
    return undefined;
  }

  return requestInfo;
};
