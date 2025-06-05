import { type ChainId } from '@/app/wagmi';
import { type Address } from 'viem';
import { arbitrum, base, mainnet } from 'viem/chains';

export const USDT_ADDRESS = {
  [mainnet.id]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  [arbitrum.id]: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  [base.id]: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
} satisfies Record<ChainId, Address>;
