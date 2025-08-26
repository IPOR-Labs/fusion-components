import { useFusionVaultAssetDecimals } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-decimals';
import { useFusionVaultAssetSymbol } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-symbol';
import { useAccountBalanceInFusionVault } from '@/fusion/plasma-vault/hooks/use-account-balance-in-fusion-vault';
import { useWithdrawManagerAddress } from '../hooks/use-withdraw-manager-address';
import { useWithdrawWindowInSeconds } from '../hooks/use-withdraw-window-in-seconds';
import { useIsAccountScheduledWithdraw } from '../hooks/use-is-account-scheduled-withdraw';
import { useFusionVaultAssetAddress } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address';
import { useWithdrawManagerFee } from '../hooks/use-withdraw-manager-fee';
import { useMaxInstantWithdrawAmount } from '../hooks/use-max-instant-withdraw-amount';
import { useAppContext } from '@/app.context';
import { useIsWrongWalletChain } from '@/app/wallet/hooks';
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';
import { useWalletSwitchChain } from '@/app/wallet/hooks/use-wallet-switch-chain';

interface Args {
  onConfirm?: () => void;
}

export const useParams = ({ onConfirm }: Args) => {
  const {
    chainId,
    fusionVaultAddress,
    connect,
  } = useAppContext();
  const isWrongWalletChain = useIsWrongWalletChain(chainId);
  const accountAddress = useWalletAccountAddress();
  const switchChain = useWalletSwitchChain();

  const assetDecimals = useFusionVaultAssetDecimals();
  const assetSymbol = useFusionVaultAssetSymbol();
  const assetAddress = useFusionVaultAssetAddress();
  const balanceToWithdraw = useAccountBalanceInFusionVault();
  const withdrawManagerAddress = useWithdrawManagerAddress();
  const withdrawWindowInSeconds = useWithdrawWindowInSeconds();
  const isWithdrawRequestPending = useIsAccountScheduledWithdraw();
  const withdrawFee = useWithdrawManagerFee({
    feeType: 'WITHDRAW_FEE',
  });
  const requestFee = useWithdrawManagerFee({
    feeType: 'REQUEST_FEE',
  });

  const maxInstantWithdrawAmount = useMaxInstantWithdrawAmount();

  return {
    chainId,
    fusionVaultAddress,
    assetAddress,
    assetDecimals,
    assetSymbol,
    balanceToWithdraw,
    isWrongWalletChain,
    switchChain,
    accountAddress,
    connect,
    onConfirm,
    withdrawManagerAddress,
    withdrawWindowInSeconds,
    isWithdrawRequestPending,
    withdrawFee,
    requestFee,
    maxInstantWithdrawAmount,
  };
};

export type Params = ReturnType<typeof useParams>;
