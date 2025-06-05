import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { useWallet } from '@/wallet/context';
import { useIsWrongWalletChain } from '@/wallet/hooks';
import { useState } from 'react';
import { useIsTxPending } from '@/transactions/hooks';
import { usePlasmaVaultAssetAddress } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetAddress';
import { usePlasmaVaultAllowanceToToken } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAllowanceToToken';
import { usePlasmaVaultName } from '@/fusion/plasma-vault/hooks/usePlasmaVaultName';
import { usePlasmaVaultSymbol } from '@/fusion/plasma-vault/hooks/usePlasmaVaultSymbol';
import { usePlasmaVaultAssetSymbol } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetSymbol';
import { usePlasmaVaultAssetDecimals } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetDecimals';
import { useAccountBalanceOfPlasmaVaultAsset } from '@/fusion/plasma-vault/hooks/useAccountBalanceOfPlasmaVaultAsset';
import { useIsAccountWhitelisted } from '@/fusion/access-manager/hooks/useIsAccountWhitelisted';
import { useWithdrawWindowInSeconds } from '@/fusion/withdraw/hooks/use-withdraw-window-in-seconds';
import { useIsScheduledWithdrawal } from '@/fusion/withdraw/hooks/use-is-scheduled-withdrawal';
import { useIsVaultPublic } from '@/fusion/plasma-vault/hooks/useIsVaultPublic';
import { usePlasmaVaultMaxDeposit } from '@/fusion/plasma-vault/hooks/usePlasmaVaultMaxDeposit';

interface Args {
  onConfirm?: () => void;
  onDepositSuccess?: () => void;
}

export const useParams = ({ onConfirm, onDepositSuccess }: Args) => {
  const {
    params: { plasmaVaultAddress, chainId },
  } = usePlasmaVault();
  const { selectWallet, accountAddress, changeChain } = useWallet();
  const isWrongWalletChain = useIsWrongWalletChain(chainId);

  const assetAddress = usePlasmaVaultAssetAddress({ plasmaVaultAddress });
  const vaultName = usePlasmaVaultName({ plasmaVaultAddress });
  const vaultSymbol = usePlasmaVaultSymbol();
  const assetSymbol = usePlasmaVaultAssetSymbol();
  const assetDecimals = usePlasmaVaultAssetDecimals({ plasmaVaultAddress });
  const assetBalance = useAccountBalanceOfPlasmaVaultAsset();
  const isVaultPublic = useIsVaultPublic();
  const isAccountWhitelisted = useIsAccountWhitelisted();
  const withdrawWindowInSeconds = useWithdrawWindowInSeconds();
  const isScheduledWithdrawal = useIsScheduledWithdrawal({
    plasmaVaultAddress,
  });
  const isApproving = useIsTxPending('plasmaVaultDepositApprove');
  const isPending = useIsTxPending('plasmaVaultDeposit');

  const assetAllowance = usePlasmaVaultAllowanceToToken({
    tokenAddress: assetAddress,
  });
  const [allowanceFromEvent, setAllowanceFromEvent] = useState<bigint>();
  const allowance = allowanceFromEvent ?? assetAllowance;

  const { data: maxDeposit } = usePlasmaVaultMaxDeposit();

  return {
    chainId,
    plasmaVaultAddress,
    vaultName,
    vaultSymbol,
    assetAddress,
    assetSymbol,
    assetDecimals,
    assetBalance,
    canDeposit: isVaultPublic || isAccountWhitelisted,
    isWrongWalletChain,
    switchChain: () => changeChain(chainId),
    accountAddress,
    selectWallet,
    onConfirm,
    onDepositSuccess,
    open,
    allowance,
    setAllowanceFromEvent,
    isApproving,
    isPending,
    withdrawWindowInSeconds,
    isScheduledWithdrawal,
    maxDeposit,
  };
};

export type Params = ReturnType<typeof useParams>;
