import { keepPreviousData } from '@tanstack/react-query';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { useReadContract } from 'wagmi';
import { useWithdrawManagerAddress } from './use-withdraw-manager-address';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { type WithdrawManagerFeeType } from '../withdraw.types';
import { assertNever } from '@/lib/assert-never';
import { useAppContext } from '@/app.context';

interface Args {
  feeType: WithdrawManagerFeeType;
}

export const useWithdrawManagerFee = ({
  feeType,
}: Args) => {
  const withdrawManagerAddress = useWithdrawManagerAddress();
  const {
    chainId,
  } = useAppContext();

  const { data: feeAmount } = useReadContract({
    chainId,
    address: withdrawManagerAddress,
    abi: withdrawManagerAbi,
    functionName: getFunctionName(feeType),
    query: {
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return feeAmount;
};

const getFunctionName = (feeType: WithdrawManagerFeeType) => {
  if (feeType === 'WITHDRAW_FEE') {
    return 'getWithdrawFee';
  }
  if (feeType === 'REQUEST_FEE') {
    return 'getRequestFee';
  }

  return assertNever(feeType, 'Invalid feeType');
};
