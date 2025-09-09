import { keepPreviousData } from '@tanstack/react-query';
import { useReadContract } from 'wagmi';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { useConfigContext } from '@/app/config/config.context';
import { universalReaderPrehooksInfoAbi } from '@/fusion/prehooks/abi/universal-reader-prehooks-info.abi';
import { UNIVERSAL_READER_PREHOOKS_INFO_ADDRESSES } from '@/fusion/prehooks/prehooks.addresses';

export const usePrehooksInfo = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();

  return useReadContract({
    chainId,
    address: UNIVERSAL_READER_PREHOOKS_INFO_ADDRESSES[chainId],
    abi: universalReaderPrehooksInfoAbi,
    functionName: 'getPreHooksInfo',
    args: [fusionVaultAddress],
    query: {
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });
};

export type Prehook = NonNullable<
  ReturnType<typeof usePrehooksInfo>['data']
>[number];
