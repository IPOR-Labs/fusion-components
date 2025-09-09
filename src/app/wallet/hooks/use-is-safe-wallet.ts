import { useConfigContext } from '@/app/config/config.context';
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';
import { useReadContract } from 'wagmi';

export const useIsSafeWallet = () => {
  const { chainId } = useConfigContext();
  const accountAddress = useWalletAccountAddress();

  const { data: owners, error } = useReadContract({
    chainId,
    address: accountAddress,
    abi: safeAbiFragment,
    functionName: 'getOwners',
    query: {
      enabled: accountAddress !== undefined,
    },
  });

  if (error) return false;

  return Array.isArray(owners);
};

const safeAbiFragment = [
  {
    constant: true,
    inputs: [],
    name: 'getOwners',
    outputs: [{ name: '', type: 'address[]' }],
    type: 'function',
  },
];
