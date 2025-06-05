import { useAccountSharesInPlasmaVault } from '@/fusion/plasma-vault/hooks/useAccountSharesInPlasmaVault';
import { usePlasmaVaultConvertToAssets } from '@/fusion/plasma-vault/hooks/usePlasmaVaultConvertToAssets';

export const useAccountBalanceInPlasmaVault = () => {
  const shares = useAccountSharesInPlasmaVault();

  return usePlasmaVaultConvertToAssets({ shares });
};
