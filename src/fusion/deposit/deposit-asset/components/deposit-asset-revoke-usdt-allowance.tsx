import { TokenIcon } from '@/components/token-icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { USDT_ADDRESS } from '@/utils/erc20.addresses';
import { RevokeAllowance } from '@/app/allowance/revoke-allowance/revoke-allowance';
import { mainnet } from 'viem/chains';
import { useAppContext } from '@/app/app.context';

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
    chainId,
    fusionVaultAddress,
  } = useAppContext();

  return (
    <RevokeAllowance
      chainId={chainId}
      tokenAddress={USDT_ADDRESS[chainId]}
      spender={fusionVaultAddress}
      newAllowance={newUsdtAllowance}
      onDone={onDone}
      onUpdateAllowance={onUpdateAllowance}
    />
  );
};
