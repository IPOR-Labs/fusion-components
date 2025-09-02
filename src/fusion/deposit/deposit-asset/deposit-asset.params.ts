import { useState } from 'react';
import { useFusionVaultAssetAddress } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address';
import { useFusionVaultAllowanceToToken } from '@/fusion/plasma-vault/hooks/use-fusion-vault-allowance-to-token';
import { useFusionVaultName } from '@/fusion/plasma-vault/hooks/use-fusion-vault-name';
import { useFusionVaultSymbol } from '@/fusion/plasma-vault/hooks/use-fusion-vault-symbol';
import { useFusionVaultAssetSymbol } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-symbol';
import { useFusionVaultAssetDecimals } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-decimals';
import { useAccountBalanceOfFusionVaultAsset } from '@/fusion/plasma-vault/hooks/use-account-balance-of-fusion-vault-asset';
import { useIsAccountWhitelisted } from '@/fusion/access-manager/hooks/use-is-account-whitelisted';
import { useWithdrawWindowInSeconds } from '@/fusion/withdraw/hooks/use-withdraw-window-in-seconds';
import { useIsScheduledWithdrawal } from '@/fusion/withdraw/hooks/use-is-scheduled-withdrawal';
import { useIsVaultPublic } from '@/fusion/plasma-vault/hooks/use-is-vault-public';
import { useFusionVaultMaxDeposit } from '@/fusion/plasma-vault/hooks/use-fusion-vault-max-deposit';
import { useIsFunctionPaused } from '@/fusion/prehooks/hooks/use-is-function-paused';

export const useParams = () => {
  const assetAddress = useFusionVaultAssetAddress();
  const vaultName = useFusionVaultName();
  const vaultSymbol = useFusionVaultSymbol();
  const assetSymbol = useFusionVaultAssetSymbol();
  const assetDecimals = useFusionVaultAssetDecimals();
  const assetBalance = useAccountBalanceOfFusionVaultAsset();
  const isVaultPublic = useIsVaultPublic();
  const isAccountWhitelisted = useIsAccountWhitelisted();
  const withdrawWindowInSeconds = useWithdrawWindowInSeconds();
  const isScheduledWithdrawal = useIsScheduledWithdrawal();

  const assetAllowance = useFusionVaultAllowanceToToken({
    tokenAddress: assetAddress,
  });
  const [allowanceFromEvent, setAllowanceFromEvent] = useState<bigint>();
  const allowance = allowanceFromEvent ?? assetAllowance;

  const maxDeposit = useFusionVaultMaxDeposit();

  const isDepositPaused = useIsFunctionPaused({ writeFunctionName: 'deposit' });

  return {
    vaultName,
    vaultSymbol,
    assetAddress,
    assetSymbol,
    assetDecimals,
    assetBalance,
    withdrawWindowInSeconds,
    isScheduledWithdrawal,
    maxDeposit,
    isDepositPaused,
    isWhitelisted: isVaultPublic || isAccountWhitelisted,
    allowance,
    setAllowanceFromEvent,
  };
};

export type Params = ReturnType<typeof useParams>;
