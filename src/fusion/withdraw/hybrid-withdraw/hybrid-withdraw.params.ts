import { useFusionVaultAssetDecimals } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-decimals';
import { useFusionVaultAssetSymbol } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-symbol';
import { useAccountBalanceInFusionVault } from '@/fusion/plasma-vault/hooks/use-account-balance-in-fusion-vault';
import { useWithdrawManagerAddress } from '../hooks/use-withdraw-manager-address';
import { useWithdrawWindowInSeconds } from '../hooks/use-withdraw-window-in-seconds';
import { useIsAccountScheduledWithdraw } from '../hooks/use-is-account-scheduled-withdraw';
import { useFusionVaultAssetAddress } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address';
import { useWithdrawManagerFee } from '../hooks/use-withdraw-manager-fee';
import { useMaxInstantWithdrawAmount } from '../hooks/use-max-instant-withdraw-amount';
import { useIsWrongWalletChain } from '@/app/wallet/hooks';
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';
import { useAccountSharesInFusionVault } from '@/fusion/plasma-vault/hooks/use-account-shares-in-fusion-vault';
import { useIsFunctionPaused } from '@/fusion/prehooks/hooks/use-is-function-paused';
import { useConvertToShares } from '@/fusion/withdraw/hooks/use-convert-to-shares';

export const useParams = () => {
  const isWrongWalletChain = useIsWrongWalletChain();
  const accountAddress = useWalletAccountAddress();

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
  const sharesBalance = useAccountSharesInFusionVault();

  const convertToShares = useConvertToShares();

  const isRedeemPaused = useIsFunctionPaused({
    writeFunctionName: 'redeem',
  });
  const isRequestSharesPaused = useIsFunctionPaused({
    writeFunctionName: 'requestShares',
  });
  const isWithdrawPaused = useIsFunctionPaused({
    writeFunctionName: 'withdraw',
  });

  return {
    // vault
    assetAddress,
    assetDecimals,
    assetSymbol,
    withdrawManagerAddress,
    withdrawWindowInSeconds,
    withdrawFee,
    requestFee,
    convertToShares,
    isRedeemPaused,
    isRequestSharesPaused,
    isWithdrawPaused,
    
    // account
    balanceToWithdraw,
    accountAddress,
    isWithdrawRequestPending,
    maxInstantWithdrawAmount,
    sharesBalance,

    // wallet
    isWrongWalletChain,
  };
};

export type Params = ReturnType<typeof useParams>;
