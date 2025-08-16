import { TokenIcon } from '@/components/token-icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { USDT_ADDRESS } from '@/fusion/markets/erc20/erc20.addresses';
import { usePlasmaVault } from '@/fusion/plasma-vault/plasma-vault.context';
import { RevokeAllowance } from '@/revokeAllowance';
import { mainnet } from 'viem/chains';

interface Props {
  newUsdtAllowance: bigint;
  onDone: () => void;
  onUpdateAllowance: (newAllowance: bigint) => void;
  isOpen: boolean;
}

export const DepositAssetRevokeUsdtAllowance = (props: Props) => {
  return (
    <Dialog open={props.isOpen}>
      <DialogContent
        className="theme-IPOR overflow-hidden pb-10"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <TokenIcon chainId={mainnet.id} address={USDT_ADDRESS[mainnet.id]} />
            USDT requires revoking approval before approving higher value
          </DialogTitle>
        </DialogHeader>
        <Content {...props} />
      </DialogContent>
    </Dialog>
  );
};

const Content = ({ newUsdtAllowance, onDone, onUpdateAllowance }: Props) => {
  const {
    params: { chainId, plasmaVaultAddress },
  } = usePlasmaVault();

  return (
    <RevokeAllowance
      chainId={chainId}
      tokenAddress={USDT_ADDRESS[chainId]}
      spender={plasmaVaultAddress}
      newAllowance={newUsdtAllowance}
      onDone={onDone}
      onUpdateAllowance={onUpdateAllowance}
    />
  );
};
