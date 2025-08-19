import { useAccount, useReadContract } from 'wagmi';

export const useIsSafeWallet = () => {
  const { address, chainId } = useAccount();

  const { data: owners, error } = useReadContract({
    // @ts-expect-error
    chainId,
    address,
    abi: safeAbiFragment,
    functionName: 'getOwners',
    query: {
      enabled: address !== undefined && chainId !== undefined,
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
