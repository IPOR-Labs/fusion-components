import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PLASMA_VAULTS_LIST } from '@/lib/plasma-vaults-list';
import { chains, type ChainId } from '@/app/config/wagmi'
import { extractChain, type Address } from "viem";

export interface PlasmaVaultValue {
  chainId: ChainId;
  vaultAddress: Address;
};

interface Props {
  value: PlasmaVaultValue;
  setPlasmaVault: (plasmaVault: PlasmaVaultValue) => void;
}

export const PlasmaVaultPicker = ({ 
  setPlasmaVault,
  value,
}: Props) => {
  return (
    <Select
      onValueChange={(value) => {
        const [chainId, vaultAddress] = value.split('-');
        setPlasmaVault({
          chainId: +chainId as ChainId,
          vaultAddress: vaultAddress as Address,
        });
      }}
      value={`${value.chainId}-${value.vaultAddress}`}
    >
      <SelectTrigger className="w-96">
        <SelectValue placeholder="Plasma Vault" />
      </SelectTrigger>
      <SelectContent>
        {PLASMA_VAULTS_LIST.map(({
          name,
          chainId,
          vaultAddress
        }) => {
          const value = `${chainId}-${vaultAddress}`;
          const chain = extractChain({ chains, id: chainId });

          return (
            <SelectItem key={value} value={value} className="flex gap-1 justify-between">
              <div className="w-56 truncate">
                {name}
              </div>
              <div className="text-xs text-muted-foreground">
                {chain.name}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  );
};