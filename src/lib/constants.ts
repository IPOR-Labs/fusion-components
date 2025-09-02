import { parseEther } from "viem";
import { mainnet } from "viem/chains";

export const BLOCK_INTERVAL = 14 * 1000; // 14 seconds

export const DATE_FORMAT_WITH_HOUR = 'dd/MM/yy HH:mm';

export const ONE_ETHER = parseEther('1');

export const DEFAULT_DECIMALS = 18;

export const USDT_ADDRESS_MAINNET = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

export const ERC20_TOKENS_TO_REVOKE_BEFORE_APPROVE = [
  {
    chainId: mainnet.id,
    address: USDT_ADDRESS_MAINNET,
  },
] as const;

export const DISCORD_LINK = 'https://discord.com/invite/bSKzq6UMJ3';