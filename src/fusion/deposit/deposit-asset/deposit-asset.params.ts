import { useIsWrongWalletChain } from '@/app/wallet/hooks';
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
import { useConfigContext } from "@/app/config/config.context";
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';
import { useWalletSwitchChain } from '@/app/wallet/hooks/use-wallet-switch-chain';

interface Args {
  onConfirm?: () => void;
  onDepositSuccess?: () => void;
}

export const useParams = ({ onConfirm, onDepositSuccess }: Args) => {
  const {
    connect,
    chainId,
    fusionVaultAddress,
  } = useConfigContext();
  const accountAddress = useWalletAccountAddress();
  const switchChain = useWalletSwitchChain();

  const isWrongWalletChain = useIsWrongWalletChain(chainId);

  const assetAddress = useFusionVaultAssetAddress();
  const { data: vaultName } = useFusionVaultName();
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

  const { data: maxDeposit } = useFusionVaultMaxDeposit();

  const [isRevokingUsdtAllowance, setIsRevokingUsdtAllowance] = useState(false);
  const showRevokingUsdtAllowance = () => {
    setIsRevokingUsdtAllowance(true);
  };
  const hideRevokingUsdtAllowance = () => {
    setIsRevokingUsdtAllowance(false);
  };

  return {
    chainId,
    fusionVaultAddress,
    vaultName,
    vaultSymbol,
    assetAddress,
    assetSymbol,
    assetDecimals,
    assetBalance,
    isWhitelisted: isVaultPublic || isAccountWhitelisted,
    isWrongWalletChain,
    switchChain,
    accountAddress,
    connect,
    onConfirm,
    onDepositSuccess,
    allowance,
    setAllowanceFromEvent,
    withdrawWindowInSeconds,
    isScheduledWithdrawal,
    maxDeposit,
    isRevokingUsdtAllowance,
    showRevokingUsdtAllowance,
    hideRevokingUsdtAllowance,
  };
};

export type Params = ReturnType<typeof useParams>;
