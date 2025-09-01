import { useFusionVaultAssetDecimals } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-decimals';
import { useFusionVaultAssetSymbol } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-symbol';
import { useAccountBalanceInFusionVault } from '@/fusion/plasma-vault/hooks/use-account-balance-in-fusion-vault';
import { useWithdrawManagerAddress } from '../hooks/use-withdraw-manager-address';
import { useWithdrawWindowInSeconds } from '../hooks/use-withdraw-window-in-seconds';
import { useIsAccountScheduledWithdraw } from '../hooks/use-is-account-scheduled-withdraw';
import { useFusionVaultAssetAddress } from '@/fusion/plasma-vault/hooks/use-fusion-vault-asset-address';
import { useWithdrawManagerFee } from '../hooks/use-withdraw-manager-fee';
import { useMaxInstantWithdrawAmount } from '../hooks/use-max-instant-withdraw-amount';
import { useConfigContext } from "@/app/config/config.context";
import { useIsWrongWalletChain } from '@/app/wallet/hooks';
import { useWalletAccountAddress } from '@/app/wallet/hooks/use-wallet-account-address';
import { useWalletSwitchChain } from '@/app/wallet/hooks/use-wallet-switch-chain';
import { useAccountSharesInFusionVault } from '@/fusion/plasma-vault/hooks/use-account-shares-in-fusion-vault';
import { usePublicClient } from 'wagmi';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';

interface Args {
  onConfirm?: () => void;
}

export const useParams = ({ onConfirm }: Args) => {
  const {
    chainId,
    fusionVaultAddress,
    connect,
  } = useConfigContext();
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
  const sharesBalance = useAccountSharesInFusionVault();

  const publicClient = usePublicClient({ chainId });
  const convertToShares = async (assets: bigint) => {
    const shares = await publicClient.readContract({
      address: fusionVaultAddress,
      abi: plasmaVaultAbi,
      functionName: 'convertToShares',
      args: [assets],
    });

    return shares;
  };

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
    sharesBalance,
    convertToShares,
  };
};

export type Params = ReturnType<typeof useParams>;
