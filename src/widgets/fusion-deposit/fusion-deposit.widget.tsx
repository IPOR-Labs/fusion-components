import type { FusionDepositConfig } from './fusion-deposit.types'

interface Props {
  config: FusionDepositConfig
}

export const FusionDepositWidget = ({ config }: Props) => {
  const hasWallet = !!config.walletClient
  const hasConnect = !!config.connect

  return (
    <div className="fusion-widget">
      <h1 className="text-xl font-bold mb-4">Fusion Deposit/Withdraw Widget</h1>
      
      <div className="space-y-2 text-sm">
        <div>Wallet Connected: {hasWallet ? 'Yes' : 'No'}</div>
        <div>Connect Function: {hasConnect ? 'Available' : 'Not provided'}</div>
        <div>Error Handler: {config.onError ? 'Available' : 'Not provided'}</div>
      </div>

      {!hasWallet && hasConnect && (
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => config.connect?.()}
        >
          Connect Wallet
        </button>
      )}

      {hasWallet && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800">Wallet is connected and ready for transactions!</p>
        </div>
      )}
    </div>
  )
}
