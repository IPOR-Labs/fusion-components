import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { PLASMA_VAULTS_LIST } from '@/lib/plasma-vaults-list';
import { chains, type ChainId } from '@/app/config/wagmi'
import { extractChain, type Address } from "viem";
import { useId } from "react";

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
  const triggerId = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={triggerId}>Plasma Vault</Label>
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
        <SelectTrigger id={triggerId} className="w-full">
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
                <div className="w-72 truncate text-left">
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
    </div>
  );
};