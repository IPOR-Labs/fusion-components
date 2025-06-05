import { type TransactionKey } from '@/transactions/types';

type ToastMessages = {
  PENDING: string;
  PENDING_SECONDARY?: string;
  SUCCESS: string;
  ERROR: string;
};

export const TX_TOAST_MESSAGE: Record<TransactionKey, ToastMessages> = {
  approve: {
    PENDING: 'Approving transfer',
    SUCCESS: 'Transfer approved',
    ERROR: 'Transfer was not approved',
  },
  revokeUsdtApprovalRouter: {
    PENDING: 'Revoking USDT approval',
    SUCCESS: 'Approval revoked',
    ERROR: 'Approval was not revoked',
  },
  revokeUsdtApprovalAccountEnso: {
    PENDING: 'Revoking USDT approval',
    SUCCESS: 'USDT approval revoked',
    ERROR: 'USDT approval was not revoked',
  },
  revokeAllowance: {
    PENDING: 'Revoking allowance',
    SUCCESS: 'Allowance revoked',
    ERROR: 'Allowance was not revoked',
  },
  accountEnsoApprove: {
    PENDING: 'Approving zap',
    SUCCESS: 'Zap approved',
    ERROR: 'Zap was not approved',
  },
  provideLiquidity: {
    PENDING: 'Depositing asset to Liquidity Pool',
    // TODO: Allow to pass assetType to this message
    // PENDING_SECONDARY: (assetType: AssetType) => `In this transaction ${assetType} will be converted to ip${assetType}`,
    PENDING_SECONDARY:
      'In this transaction asset will be converted to ipTokens',
    SUCCESS: 'Your deposit was successfull',
    ERROR: 'Your deposit cannot be completed',
  },
  openSwap: {
    PENDING: 'Opening swap',
    SUCCESS: 'Your swap has been opened',
    ERROR: 'Swap cannot be opened',
  },
  closeSwap: {
    PENDING: 'Closing swap and transferring tokens to your wallet',
    SUCCESS: 'Your swap has been closed',
    ERROR: 'Your swap cannot be closed',
  },
  redeemFromAmmPool: {
    PENDING: 'Transfering asset to your wallet',
    PENDING_SECONDARY:
      'IpTokens will be converted to asset in this transaction',
    // TODO: Allow to pass assetType to this message
    // REDEEMING_SECONDARY: (assetType: AssetType) => `ip${assetType} will be converted to ${assetType} in this transaction`,
    SUCCESS: 'Your deposit has been transferred to your wallet',
    ERROR: 'Your deposit cannot be transferred to your wallet',
  },
  stakeLpTokensToLiquidityMining: {
    PENDING: 'Your ipTokens are being transferred to staking pool',
    SUCCESS: 'Your ipTokens have been staked',
    ERROR: 'Your ipTokens cannot be staked',
  },
  unstakeLpTokensFromLiquidityMining: {
    PENDING: 'IpTokens are being transferred from staking pool to your wallet',
    SUCCESS: 'Your ipTokens have been unstaked',
    ERROR: 'Your ipTokens cannot be unstaked',
  },
  delegatePwTokensToLiquidityMining: {
    PENDING: 'Delegating pwIPOR tokens to staking pool',
    SUCCESS: 'Your pwIPOR tokens have been delegated',
    ERROR: 'Your pwIPOR tokens cannot be delegated',
  },
  pwTokenCancelCooldown: {
    PENDING: 'Canceling cooldown on your IPOR tokens',
    SUCCESS: 'Cooldown has been canceled',
    ERROR: 'Canceling cooldown has failed',
  },
  pwTokenCooldown: {
    PENDING: `Setting cooldown on your IPOR tokens`,
    SUCCESS: 'Cooldown has been set successfully',
    ERROR: 'Setting cooldown has failed',
  },
  redeemPwToken: {
    PENDING: 'Your IPOR tokens are being transferred to your wallet',
    SUCCESS: 'Your IPOR tokens has been transferred to your wallet',
    ERROR: 'Your pwIPOR tokens cannot be unstaked',
  },
  claimRewardsFromLiquidityMining: {
    PENDING: 'Claiming your rewards',
    PENDING_SECONDARY: `In this transaction you will receive pwIPOR tokens`,
    SUCCESS: 'Your rewards have been claimed successfully',
    ERROR: 'Your rewards cannot be claimed',
  },
  stakeGovernanceTokenToPowerToken: {
    PENDING: 'Your IPOR tokens are being transferred to staking pool',
    SUCCESS: 'Your IPOR tokens has been staked',
    ERROR: 'Your tokens cannot be staked',
  },
  undelegatePwTokensFromLiquidityMining: {
    PENDING: 'Undelegating IPOR tokens from staking pool',
    SUCCESS: 'Your IPOR tokens have been undelegated',
    ERROR: 'Your IPOR tokens cannot be undelegated',
  },
  unstakeGovernanceTokenFromPowerToken: {
    PENDING: 'Your IPOR tokens are being transferred to your wallet',
    SUCCESS: 'Your IPOR tokens has been transferred to your wallet',
    ERROR: 'Your pwIPOR tokens cannot be unstaked',
  },
  zap: {
    PENDING: 'Zapping in progress',
    SUCCESS: 'Zapping completed successfully',
    ERROR: 'Zapping unsuccessful',
  },
  compoundRewards: {
    PENDING: 'Claim & Power-up in progress',
    SUCCESS: 'Claim & Power-up completed successfully',
    ERROR: 'Claim & Power-up unsuccessful',
  },
  claimFromTestnetFaucet: {
    PENDING: 'Transfering assets to your wallet',
    SUCCESS: 'Assets have been transferred to your wallet',
    ERROR: 'Cannot claim assets',
  },
  merkleTreeRewardsClaim: {
    ERROR: 'Claiming rewards failed',
    PENDING: 'Claiming rewards',
    SUCCESS: 'Rewards was claimed',
  },
  merkleTreeRewardsSetRoot: {
    ERROR: 'Setting merkle tree root failed',
    PENDING: 'Setting merkle tree root',
    SUCCESS: 'Merkle tree root was set',
  },
  plasmaVaultDeposit: {
    PENDING: 'Depositing assets to Plasma Vault',
    SUCCESS: 'Your deposit was successfull',
    ERROR: 'Your deposit cannot be completed',
  },
  plasmaVaultMaxRedeem: {
    PENDING: 'Withdrawing all assets from Plasma Vault',
    SUCCESS: 'Withdrawal all assets completed successfully',
    ERROR: 'Withdrawal failed',
  },
  plasmaVaultExecute: {
    PENDING: 'Executing transaction on Plasma Vault',
    SUCCESS: 'Transaction executed successfully',
    ERROR: 'Transaction execution failed',
  },
  plasmaVaultGrantRole: {
    PENDING: 'Granting role on Plasma Vault',
    SUCCESS: 'Role granted successfully',
    ERROR: 'Role granting failed',
  },
  plasmaVaultRevokeRole: {
    PENDING: 'Revoking role on Plasma Vault',
    SUCCESS: 'Role revoked successfully',
    ERROR: 'Role revoking failed',
  },
  plasmaVaultConfigureManagementFee: {
    PENDING: 'Configuring management fee on Plasma Vault',
    SUCCESS: 'Management fee configured successfully',
    ERROR: 'Management fee configuration failed',
  },
  plasmaVaultConfigurePerformanceFee: {
    PENDING: 'Configuring performance fee on Plasma Vault',
    SUCCESS: 'Performance fee configured successfully',
    ERROR: 'Performance fee configuration failed',
  },
  rewardsClaimManagerAddRewardFuses: {
    PENDING: 'Adding reward fuses to Plasma Vault',
    SUCCESS: 'Reward fuses added successfully',
    ERROR: 'Adding reward fuses to Plasma Vault failed',
  },
  rewardsClaimManagerRemoveRewardFuses: {
    PENDING: 'Removing reward fuses from Plasma Vault',
    SUCCESS: 'Reward fuses removed successfully',
    ERROR: 'Removing reward fuses from Plasma Vault failed',
  },
  plasmaVaultAddFuses: {
    PENDING: 'Adding fuses to Plasma Vault',
    SUCCESS: 'Fuses added successfully',
    ERROR: 'Adding fuses to Plasma Vault failed',
  },
  plasmaVaultRemoveFuses: {
    PENDING: 'Removing fuses from Plasma Vault',
    SUCCESS: 'Fuses removed successfully',
    ERROR: 'Removing fuses from Plasma Vault failed',
  },
  plasmaVaultUpdateTrackedAssets: {
    PENDING: 'Updating tracked assets on Plasma Vault',
    SUCCESS: 'Tracked assets updated successfully',
    ERROR: 'Tracked assets update failed',
  },
  plasmaVaultUpdateSubstrates: {
    PENDING: 'Updating Plasma Vault substrates',
    SUCCESS: 'Plasma Vault substrates updated successfully',
    ERROR: 'Plasma Vault substrates update failed',
  },
  plasmaVaultDepositApprove: {
    PENDING: 'Approving asset for Plasma Vault',
    SUCCESS: 'Asset approved successfully',
    ERROR: 'Asset approval failed',
  },
  reapprove: {
    PENDING: 'Reapproving',
    SUCCESS: 'Reapproval completed successfully',
    ERROR: 'Reapproval failed',
  },
  withdrawManagerRequest: {
    PENDING: 'Requesting withdrawal',
    SUCCESS: 'Withdrawal requested successfully',
    ERROR: 'Withdrawal request failed',
  },
  withdrawManagerReleaseFunds: {
    PENDING: 'Releasing funds from Withdraw Manager',
    SUCCESS: 'Funds released successfully',
    ERROR: 'Funds release failed',
  },
  withdrawManagerUpdateWithdrawWindow: {
    PENDING: 'Updating withdraw window',
    SUCCESS: 'Withdraw window updated successfully',
    ERROR: 'Withdraw window update failed',
  },
  plasmaVaultWithdraw: {
    PENDING: 'Withdrawing from Plasma Vault',
    SUCCESS: 'Withdrawal completed successfully',
    ERROR: 'Withdrawal failed',
  },
  plasmaVaultZapIn: {
    PENDING: 'Zapping in progress',
    SUCCESS: 'Zapping completed successfully',
    ERROR: 'Zapping unsuccessful',
  },
  plasmaVaultAddBalanceFuse: {
    PENDING: 'Adding balance fuse to Plasma Vault',
    SUCCESS: 'Balance fuse added successfully',
    ERROR: 'Adding balance fuse to Plasma Vault failed',
  },
  plasmaVaultRemoveBalanceFuse: {
    PENDING: 'Removing balance fuse from Plasma Vault',
    SUCCESS: 'Balance fuse removed successfully',
    ERROR: 'Removing balance fuse from Plasma Vault failed',
  },
  plasmaVaultUpdateDependencyBalanceGraph: {
    PENDING: 'Updating dependency balance graph on Plasma Vault',
    SUCCESS: 'Dependency balance graph updated successfully',
    ERROR: 'Updating dependency balance graph on Plasma Vault failed',
  },
  plasmaVaultSetPriceOracleMiddleware: {
    PENDING: 'Setting price oracle on Plasma Vault',
    SUCCESS: 'Price oracle set successfully',
    ERROR: 'Setting price oracle on Plasma Vault failed',
  },
  plasmaVaultApproveZapIn: {
    PENDING: 'Approving zap',
    SUCCESS: 'Zap approved',
    ERROR: 'Zap was not approved',
  },
  plasmaVaultRedeemFromRequest: {
    PENDING: 'Redeeming from Plasma Vault',
    SUCCESS: 'Redeem completed successfully',
    ERROR: 'Redeem failed',
  },
  plasmaVaultSetPrehookImplementations: {
    PENDING: 'Setting prehooks on Plasma Vault',
    SUCCESS: 'Prehooks set successfully',
    ERROR: 'Setting prehooks on Plasma Vault failed',
  },
  plasmaVaultUpdateManagementFee: {
    PENDING: 'Updating management fee on Plasma Vault',
    SUCCESS: 'Management fee updated successfully',
    ERROR: 'Updating management fee on Plasma Vault failed',
  },
  plasmaVaultUpdatePerformanceFee: {
    PENDING: 'Updating performance fee on Plasma Vault',
    SUCCESS: 'Performance fee updated successfully',
    ERROR: 'Updating performance fee on Plasma Vault failed',
  },
  plasmaVaultSetPausedFunctions: {
    PENDING: 'Pausing functions on Plasma Vault',
    SUCCESS: 'Paused functions set successfully',
    ERROR: 'Pausing functions on Plasma Vault failed',
  },
  priceOracleGrantRole: {
    PENDING: 'Granting role on Price Oracle',
    SUCCESS: 'Role granted successfully',
    ERROR: 'Role granting failed',
  },
  plasmaVaultConvertToPublicVault: {
    PENDING: 'Converting Plasma Vault to public vault',
    SUCCESS: 'Plasma Vault converted to public vault successfully',
    ERROR: 'Plasma Vault conversion to public vault failed',
  },
  plasmaVaultConfigureInstantWithdrawalFuses: {
    PENDING: 'Configuring instant withdrawal fuses on Plasma Vault',
    SUCCESS: 'Instant withdrawal fuses configured successfully',
    ERROR: 'Configuring instant withdrawal fuses on Plasma Vault failed',
  },
  plasmaVaultSetTotalSupplyCap: {
    PENDING: 'Setting total supply cap on Plasma Vault',
    SUCCESS: 'Total supply cap configured successfully',
    ERROR: 'Setting total supply cap on Plasma Vault failed',
  },
  withdrawManagerUpdateFee: {
    PENDING: 'Updating fee',
    SUCCESS: 'Fee updated successfully',
    ERROR: 'Updating fee failed',
  },
  plasmaVaultHarvestAllFees: {
    PENDING: 'Harvesting all fees',
    SUCCESS: 'Fees harvested successfully',
    ERROR: 'Harvesting fees failed',
  },
  access_manager__schedule_operation: {
    PENDING: 'Scheduling transaction',
    SUCCESS: 'Transaction scheduled successfully',
    ERROR: 'Transaction scheduling failed',
  },
  access_manager__cancel_scheduled_operation: {
    PENDING: 'Cancelling scheduled transaction',
    SUCCESS: 'Scheduled transaction cancelled successfully',
    ERROR: 'Scheduled transaction cancellation failed',
  },
  access_manager__execute_scheduled_operation: {
    PENDING: 'Executing scheduled transaction',
    SUCCESS: 'Scheduled transaction executed successfully',
    ERROR: 'Scheduled transaction execution failed',
  },
};
