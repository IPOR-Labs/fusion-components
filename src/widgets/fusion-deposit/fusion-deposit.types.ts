import type { WalletClient } from 'viem'

export interface FusionDepositConfig {
  /** Optional viem WalletClient for wallet operations */
  walletClient?: WalletClient | undefined
  /** Function to call when wallet connection is requested */
  connect?: () => Promise<void>
  /** Error handler for user-impacting failures */
  onError?: (err: unknown) => void
}
