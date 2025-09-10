import { type Address } from 'viem';
import { to18 } from '@/lib/to18';
import { usePlasmaVaultAssetPrice } from '@/fusion/plasma-vault/hooks/use-plasma-vault-asset-price';

interface Params {
  assetAddress: Address | undefined;
}

export const usePlasmaVaultAssetPrice_18 = ({
  assetAddress,
}: Params) => {
  const result = usePlasmaVaultAssetPrice({
    assetAddress,
  });

  if (result.data === undefined) {
    return result;
  }

  const { data, error, isFetching } = result;
  const assetUsdPrice_18 = to18(data[0], Number(data[1]));

  return {
    data: assetUsdPrice_18,
    error,
    isFetching,
  };
};
