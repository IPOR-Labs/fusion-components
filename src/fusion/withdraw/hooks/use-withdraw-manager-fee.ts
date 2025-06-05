import { keepPreviousData } from '@tanstack/react-query';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { useReadContract } from 'wagmi';
import { useWithdrawManagerAddress } from './use-withdraw-manager-address';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';
import { type Address } from 'viem';
import { type WithdrawManagerFeeType } from '../withdraw.types';
import { assertNever } from '@/utils/assertNever';

interface Args {
  plasmaVaultAddress: Address;
  feeType: WithdrawManagerFeeType;
}

export const useWithdrawManagerFee = ({
  plasmaVaultAddress,
  feeType,
}: Args) => {
  const withdrawManagerAddress = useWithdrawManagerAddress({
    plasmaVaultAddress,
  });
  const {
    params: { chainId },
  } = usePlasmaVault();

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
