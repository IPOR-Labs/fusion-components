import { keepPreviousData } from '@tanstack/react-query';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { useWallet } from '@/wallet/context';
import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';

interface Args {
  tokenAddress: Address | undefined;
  enabled?: boolean;
}

export const usePlasmaVaultAllowanceToToken = ({
  tokenAddress,
  enabled = true,
}: Args) => {
  const {
    params: { plasmaVaultAddress, chainId },
  } = usePlasmaVault();
  const { accountAddress } = useWallet();

  const { data } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    args: [accountAddress!, plasmaVaultAddress],
    functionName: 'allowance',
    chainId,
    query: {
      enabled: Boolean(accountAddress) && Boolean(tokenAddress) && enabled,
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return data;
};
