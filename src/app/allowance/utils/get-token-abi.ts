import { usdtAbi } from '@/abi/getErc20abi';
import { type Address, erc20Abi } from 'viem';

const USDT_MAINNET_ADDRESS =
  '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const;

export const getTokenAbi = (address: Address | undefined) => {
  if (USDT_MAINNET_ADDRESS === address) {
    return usdtAbi;
  }

  return erc20Abi;
};
