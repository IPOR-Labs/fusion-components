import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PLASMA_VAULTS_LIST } from '@/lib/plasma-vaults-list';
import type { ChainId } from '@/app/config/wagmi'
import type { Address } from "viem";

export interface PlasmaVaultValue {
  chainId: ChainId;
  vaultAddress: Address;
};

interface Props {
  setPlasmaVault: (plasmaVault: PlasmaVaultValue) => void;
}

export const PlasmaVaultPicker = ({ setPlasmaVault }: Props) => {
  return (
    <Select
      onValueChange={(value) => {
        const [chainId, vaultAddress] = value.split('-');
        setPlasmaVault({
          chainId: +chainId as ChainId,
          vaultAddress: vaultAddress as Address,
        });
      }}
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
          return (
            <SelectItem key={value} value={value}>
              {name}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  );
};