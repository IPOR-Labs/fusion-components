import { useState } from "react";
import { useFusionVaultAssetAddress } from "@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address";
import { useFusionVaultAssetDecimals } from "@/fusion/plasma-vault/hooks/use-fusion-vault-asset-decimals";
import { useFusionVaultAssetSymbol } from "@/fusion/plasma-vault/hooks/use-fusion-vault-asset-symbol";
import { useFusionVaultConvertToAssets } from "@/fusion/plasma-vault/hooks/use-fusion-vault-convert-to-assets";
import { usePlasmaVaultUnderlyingAssetPrice_18 } from "@/fusion/plasma-vault/hooks/use-plasma-vault-underlying-asset-price-18";
import { useIsFunctionPaused } from "@/fusion/prehooks/hooks/use-is-function-paused";
import { useAccountWithdrawRequestInfo } from "@/fusion/withdraw/hooks/use-account-withdraw-request-info";

export const useParams = () => {
  const [showBalanceInDollars, setShowBalanceInDollars] = useState(false);

  const assetDecimals = useFusionVaultAssetDecimals();
  const assetAddress = useFusionVaultAssetAddress();
  const assetSymbol = useFusionVaultAssetSymbol();
  const underlyingAssetPrice = usePlasmaVaultUnderlyingAssetPrice_18();

  const requestInfo = useAccountWithdrawRequestInfo();
  const requestedAssets = useFusionVaultConvertToAssets({
    shares: requestInfo?.shares,
  });

  const isRedeemFromRequestPaused = useIsFunctionPaused({
    writeFunctionName: 'redeemFromRequest',
  });

  return {
    assetDecimals,
    assetAddress,
    assetSymbol,
    underlyingAssetPrice,
    requestedAmount: requestInfo?.shares,
    requestedAssets,
    endWithdrawWindowTimestamp: requestInfo?.endWithdrawWindowTimestamp,
    withdrawWindowInSeconds: requestInfo?.withdrawWindowInSeconds,
    canWithdraw: requestInfo?.canWithdraw,
    showBalanceInDollars,
    setShowBalanceInDollars,
    isRedeemFromRequestPaused,
  };
};

export type Params = ReturnType<typeof useParams>;
