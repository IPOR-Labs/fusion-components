import { priceOracleMiddlewareAbi } from '@/abi/price-oracle-middleware.abi';
import { useConfigContext } from '@/app/config/config.context';
import { usePlasmaVaultPriceOracleMiddleware } from '@/fusion/plasma-vault/hooks/use-plasma-vault-price-oracle-middleware';
import { BLOCK_INTERVAL } from '@/lib/constants';
import { keepPreviousData } from '@tanstack/react-query';
import { type Address } from 'viem';
import { useReadContract } from 'wagmi';

interface Params {
  assetAddress: Address | undefined;
}

export const usePlasmaVaultAssetPrice = ({
  assetAddress,
}: Params) => {
  const {
    chainId,
  } = useConfigContext();
  const priceOracleMiddlewareAddress = usePlasmaVaultPriceOracleMiddleware();

  const result = useReadContract({
    chainId,
    address: priceOracleMiddlewareAddress,
    abi: priceOracleMiddlewareAbi,
    functionName: 'getAssetPrice',
    args: [assetAddress!],
    query: {
      enabled: assetAddress !== undefined,
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });

  return result;
};
