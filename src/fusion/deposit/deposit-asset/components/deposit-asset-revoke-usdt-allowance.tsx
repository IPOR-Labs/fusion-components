import { TokenIcon } from '@/components/token-icon';
import { USDT_ADDRESS } from '@/lib/erc20.addresses';
import { RevokeAllowance } from '@/app/allowance/revoke-allowance/revoke-allowance';
import { mainnet } from 'viem/chains';
import { useAppContext } from '@/app.context';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  newUsdtAllowance: bigint;
  onDone: () => void;
  onUpdateAllowance: (newAllowance: bigint) => void;
}

export const DepositAssetRevokeUsdtAllowance = ({
  newUsdtAllowance,
  onDone,
  onUpdateAllowance,
}: Props) => {
  const {
    chainId,
    fusionVaultAddress,
  } = useAppContext();

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4">
          <TokenIcon chainId={mainnet.id} address={USDT_ADDRESS[mainnet.id]} />
          USDT requires revoking approval before approving higher value
        </div>
        <RevokeAllowance
          chainId={chainId}
          tokenAddress={USDT_ADDRESS[chainId]}
          spender={fusionVaultAddress}
          newAllowance={newUsdtAllowance}
          onDone={onDone}
          onUpdateAllowance={onUpdateAllowance}
        />
      </CardContent>
    </Card>
  );
};
