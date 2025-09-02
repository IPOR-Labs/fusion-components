import { type Hex, toFunctionSelector, toFunctionSignature } from 'viem';
import { plasmaVaultAbi } from '@/abi/plasma-vault.abi';
import { withdrawManagerAbi } from '@/abi/withdraw-manager.abi';

const abis = [
  ...plasmaVaultAbi,
  ...withdrawManagerAbi,
] as const;

export type WriteFunctionName = Extract<
  (typeof abis)[number],
  { type: 'function'; stateMutability: 'nonpayable' | 'payable' }
>['name'];

const getPlasmaVaultWriteFunctionSelectors = () => {
  return abis.reduce(
    (acc, item) => {
      if (item.type === 'function' && item.stateMutability !== 'view') {
        const signature = toFunctionSignature(item);
        const selector = toFunctionSelector(signature);
        acc[item.name] = selector;
      }
      return acc;
    },
    {} as Record<WriteFunctionName, Hex>,
  );
};

const PLASMA_VAULT_WRITE_FUNCTION_SELECTORS =
  getPlasmaVaultWriteFunctionSelectors();

export const getPlasmaVaultWriteFunctionSelectorByFunctionName = (
  functionName: WriteFunctionName,
) => {
  return PLASMA_VAULT_WRITE_FUNCTION_SELECTORS[functionName];
};
