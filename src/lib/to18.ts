import { DEFAULT_DECIMALS } from '@/lib/constants';
import { parseUnits } from 'viem';

export const to18 = (value: bigint, decimals: number) => {
  if (decimals === DEFAULT_DECIMALS) {
    return value;
  }

  const value18 = parseUnits(value.toString(), DEFAULT_DECIMALS - decimals);

  return value18;
};
