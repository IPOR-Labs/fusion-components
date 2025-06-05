import { DEFAULT_DECIMALS } from '@/utils/constants';
import { formatSignificant } from '@/utils/format-significant';

interface Args {
  balance: bigint | undefined;
  decimals: number | undefined;
  symbol?: string;
}

export const displayBalance = ({
  balance = 0n,
  decimals,
  symbol = '',
}: Args) => {
  const _balance = decimals === undefined ? 0n : balance;
  return `${formatSignificant(_balance, decimals || DEFAULT_DECIMALS)} ${symbol}`.trim();
};
