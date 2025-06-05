import { useWallet } from '@/wallet/context';
import { useIsWrongWalletChain } from '@/wallet/hooks';
import { useIsTxPending } from '@/transactions/hooks';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { usePlasmaVaultAssetDecimals } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetDecimals';
import { usePlasmaVaultAssetSymbol } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetSymbol';
import { useAccountBalanceInPlasmaVault } from '@/fusion/plasma-vault/hooks/useAccountBalanceInPlasmaVault';
import { useWithdrawManagerAddress } from '../hooks/use-withdraw-manager-address';
import { useWithdrawWindowInSeconds } from '../hooks/use-withdraw-window-in-seconds';
import { useIsAccountScheduledWithdraw } from '../hooks/use-is-account-scheduled-withdraw';
import { usePlasmaVaultAssetAddress } from '@/fusion/plasma-vault/hooks/usePlasmaVaultAssetAddress';
import { useWithdrawManagerFee } from '../hooks/use-withdraw-manager-fee';
import { useMaxInstantWithdrawAmount } from '../hooks/use-max-instant-withdraw-amount';

interface Args {
  onConfirm?: () => void;
}

export const useParams = ({ onConfirm }: Args) => {
  const {
    params: { plasmaVaultAddress, chainId },
  } = usePlasmaVault();
  const { selectWallet, accountAddress, changeChain } = useWallet();
  const isWrongWalletChain = useIsWrongWalletChain(chainId);

  const assetDecimals = usePlasmaVaultAssetDecimals({
    plasmaVaultAddress,
  });
  const assetSymbol = usePlasmaVaultAssetSymbol();
  const assetAddress = usePlasmaVaultAssetAddress({
    plasmaVaultAddress,
  });
  const balanceToWithdraw = useAccountBalanceInPlasmaVault();
  const isPendingMaxRedeem = useIsTxPending('plasmaVaultMaxRedeem');
  const isPendingWithdraw = useIsTxPending('plasmaVaultWithdraw');
  const isPending = isPendingMaxRedeem || isPendingWithdraw;
  const withdrawManagerAddress = useWithdrawManagerAddress({
    plasmaVaultAddress,
  });
  const withdrawWindowInSeconds = useWithdrawWindowInSeconds();
  const isWithdrawRequestPending = useIsAccountScheduledWithdraw({
    accountAddress,
    plasmaVaultAddress,
  });
  const withdrawFee = useWithdrawManagerFee({
    plasmaVaultAddress,
    feeType: 'WITHDRAW_FEE',
  });
  const requestFee = useWithdrawManagerFee({
    plasmaVaultAddress,
    feeType: 'REQUEST_FEE',
  });

  const maxInstantWithdrawAmount = useMaxInstantWithdrawAmount();

  return {
    chainId,
    plasmaVaultAddress,
    assetAddress,
    assetDecimals,
    assetSymbol,
    balanceToWithdraw,
    isWrongWalletChain,
    switchChain: () => changeChain(chainId),
    accountAddress,
    selectWallet,
    onConfirm,
    isPending,
    withdrawManagerAddress,
    withdrawWindowInSeconds,
    isWithdrawRequestPending,
    withdrawFee,
    requestFee,
    maxInstantWithdrawAmount,
  };
};

export type Params = ReturnType<typeof useParams>;
