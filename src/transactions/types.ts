import { type ChainId } from '@/app/wagmi';
import { type AppError } from '@/errors/types';
import { type Hash } from 'viem';

export type TransactionKey =
  | `approve`
  | 'revokeUsdtApprovalRouter'
  | 'revokeUsdtApprovalAccountEnso'
  | 'revokeAllowance'
  | 'reapprove'
  | 'provideLiquidity'
  | 'openSwap'
  | 'closeSwap'
  | 'redeemFromAmmPool'
  | 'stakeLpTokensToLiquidityMining'
  | 'unstakeLpTokensFromLiquidityMining'
  | 'delegatePwTokensToLiquidityMining'
  | 'pwTokenCancelCooldown'
  | 'pwTokenCooldown'
  | 'redeemPwToken'
  | 'stakeGovernanceTokenToPowerToken'
  | 'undelegatePwTokensFromLiquidityMining'
  | 'unstakeGovernanceTokenFromPowerToken'
  | 'claimRewardsFromLiquidityMining'
  | 'accountEnsoApprove'
  | 'zap'
  | 'compoundRewards'
  | 'claimFromTestnetFaucet'
  | 'merkleTreeRewardsClaim'
  | 'merkleTreeRewardsSetRoot'
  | 'plasmaVaultDeposit'
  | 'plasmaVaultMaxRedeem'
  | 'plasmaVaultWithdraw'
  | 'plasmaVaultExecute'
  | 'plasmaVaultRevokeRole'
  | 'plasmaVaultGrantRole'
  | 'plasmaVaultConfigureManagementFee'
  | 'plasmaVaultConfigurePerformanceFee'
  | 'rewardsClaimManagerAddRewardFuses'
  | 'rewardsClaimManagerRemoveRewardFuses'
  | 'plasmaVaultAddFuses'
  | 'plasmaVaultRemoveFuses'
  | 'plasmaVaultUpdateTrackedAssets'
  | 'plasmaVaultUpdateSubstrates'
  | 'plasmaVaultDepositApprove'
  | 'withdrawManagerRequest'
  | 'withdrawManagerReleaseFunds'
  | 'withdrawManagerUpdateWithdrawWindow'
  | 'plasmaVaultZapIn'
  | 'plasmaVaultAddBalanceFuse'
  | 'plasmaVaultRemoveBalanceFuse'
  | 'plasmaVaultUpdateDependencyBalanceGraph'
  | 'plasmaVaultSetPriceOracleMiddleware'
  | 'plasmaVaultApproveZapIn'
  | 'plasmaVaultRedeemFromRequest'
  | 'plasmaVaultSetPrehookImplementations'
  | 'plasmaVaultUpdateManagementFee'
  | 'plasmaVaultUpdatePerformanceFee'
  | 'plasmaVaultSetPausedFunctions'
  | 'priceOracleGrantRole'
  | 'plasmaVaultConvertToPublicVault'
  | 'plasmaVaultConvertToPublicVault'
  | 'plasmaVaultConfigureInstantWithdrawalFuses'
  | 'plasmaVaultSetTotalSupplyCap'
  | 'withdrawManagerUpdateFee'
  | 'plasmaVaultHarvestAllFees'
  | 'access_manager__schedule_operation'
  | 'access_manager__cancel_scheduled_operation'
  | 'access_manager__execute_scheduled_operation';

export type TransactionData =
  | {
      state: 'pending';
    }
  | {
      state: 'success';
      savedGasCost?: bigint;
    }
  | {
      state: 'error';
      error: AppError;
    };

export type Transaction = {
  type: TransactionKey;
  chainId: ChainId;
  hash: Hash;
  data: TransactionData;
};

export type TransactionStateHandlers = {
  onInit?: () => void;
  onConfirm?: () => void;
  onSuccess?: () => void;
  onError?: (error: AppError) => void;
};
