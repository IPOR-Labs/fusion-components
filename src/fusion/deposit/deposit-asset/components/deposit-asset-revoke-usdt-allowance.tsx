import { TokenIcon } from '@/components/token-icon';
import { USDT_ADDRESS_MAINNET } from '@/lib/constants';
import { RevokeAllowance } from '@/app/allowance/revoke-allowance/revoke-allowance';
import { mainnet } from 'viem/chains';
import { useConfigContext } from "@/app/config/config.context";
import { Card, CardContent } from '@/components/ui/card';
import styles from './deposit-asset-revoke-usdt-allowance.module.css';

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
  } = useConfigContext();

  return (
    <Card>
      <CardContent>
        <div className={styles.content}>
          <TokenIcon chainId={mainnet.id} address={USDT_ADDRESS_MAINNET} />
          USDT requires revoking approval before approving higher value
        </div>
        <RevokeAllowance
          chainId={chainId}
          tokenAddress={USDT_ADDRESS_MAINNET}
          spender={fusionVaultAddress}
          newAllowance={newUsdtAllowance}
          onDone={onDone}
          onUpdateAllowance={onUpdateAllowance}
        />
      </CardContent>
    </Card>
  );
};
