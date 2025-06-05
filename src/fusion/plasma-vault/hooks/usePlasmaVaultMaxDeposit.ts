import { keepPreviousData } from '@tanstack/react-query';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { erc4626Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useWallet } from '@/wallet/context';

export const usePlasmaVaultMaxDeposit = () => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();
  const { accountAddress } = useWallet();

  return useReadContract({
    address: plasmaVaultAddress,
    abi: erc4626Abi,
    functionName: 'maxDeposit',
    chainId,
    args: [accountAddress!],
    query: {
      enabled: Boolean(accountAddress),
      placeholderData: keepPreviousData,
    },
  });
};
