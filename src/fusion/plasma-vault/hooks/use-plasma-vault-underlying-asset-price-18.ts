import { useFusionVaultAssetAddress } from "@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address";
import { usePlasmaVaultAssetPrice_18 } from "@/fusion/plasma-vault/hooks/use-plasma-vault-asset-price-18";

export const usePlasmaVaultUnderlyingAssetPrice_18 = () => {
  const underlyingAssetAddress = useFusionVaultAssetAddress();

  const { data: assetPrice_18 } = usePlasmaVaultAssetPrice_18({
    assetAddress: underlyingAssetAddress,
  });

  return assetPrice_18;
};
