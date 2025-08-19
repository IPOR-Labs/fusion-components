import { useAccountSharesInFusionVault } from '@/fusion/plasma-vault/hooks/use-account-shares-in-fusion-vault';
import { useFusionVaultConvertToAssets } from '@/fusion/plasma-vault/hooks/use-fusion-vault-convert-to-assets';

export const useAccountBalanceInFusionVault = () => {
  const shares = useAccountSharesInFusionVault();

  return useFusionVaultConvertToAssets({ shares });
};
