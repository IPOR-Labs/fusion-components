import { useQuery } from '@tanstack/react-query';
import { useConfigContext } from '@/app/config/config.context';
import { binarySearchWithdrawalSimulation } from '@/fusion/withdraw/lib/binary-search-withdrawal-simulation';
import { erc20Abi, erc4626Abi } from 'viem';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';

const MAX_SIMULATION_COUNT = 6;

/**
 * @returns amount of underlying (ERC20) represented in the asset decimals
 * that can be withdrawn immediately from the Plasma Vault
 */
export const useMaxInstantWithdrawAmount = () => {
  const {
    fusionVaultAddress,
    chainId,
  } = useConfigContext();
  const publicClient = usePublicClient({ chainId });
  const { address: accountAddress } = useAccount();

  const { data: accountBalanceShares } = useReadContract({
    chainId,
    address: fusionVaultAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [accountAddress!],
    query: {
      enabled: Boolean(accountAddress),
    },
  });

  const { data: accountBalanceUnderlying } = useReadContract({
    chainId,
    address: fusionVaultAddress,
    abi: erc4626Abi,
    functionName: 'convertToAssets',
    args: [accountBalanceShares!],
    query: {
      enabled: accountBalanceShares !== undefined,
    },
  });

  const { data: maxInstantWithdrawAmount } = useQuery({
    queryKey: [
      'maxInstantWithdrawAmount',
      chainId,
      fusionVaultAddress,
      accountAddress,
    ],
    queryFn: async () => {
      if (publicClient === undefined) {
        throw new Error('publicClient is undefined');
      }
      if (accountAddress === undefined) {
        throw new Error('accountAddress is undefined');
      }
      if (accountBalanceUnderlying === undefined) {
        throw new Error('accountBalanceUnderlying is undefined');
      }

      return binarySearchWithdrawalSimulation({
        txArgs: {
          chainId,
          publicClient,
          fusionVaultAddress,
          accountAddress,
        },
        accountBalanceUnderlying,
        maxSimulationCount: MAX_SIMULATION_COUNT,
      });
    },
    enabled:
      Boolean(accountAddress) &&
      publicClient !== undefined &&
      accountBalanceUnderlying !== undefined &&
      accountBalanceUnderlying > 0n,
    retry: false,
  });

  if (
    accountBalanceUnderlying !== undefined &&
    accountBalanceUnderlying === 0n
  ) {
    return 0n;
  }

  return maxInstantWithdrawAmount;
};
