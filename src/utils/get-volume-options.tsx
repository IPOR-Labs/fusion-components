import { formatUnits } from 'viem';

const PERCENTAGE_VOLUME_OPTIONS = ['25', '50', '75', '100'] as const;

export const getValumeOptions = ({
  balance,
  decimals,
  currentValue,
}: {
  balance: bigint;
  decimals: number;
  currentValue: string;
}) => {
  const balanceString = formatUnits(balance, decimals);

  return PERCENTAGE_VOLUME_OPTIONS.map((option) => {
    if (option === '100') {
      return {
        value: balanceString,
        option,
        isActive: balance !== 0n && currentValue === balanceString,
      };
    }

    const value = (balance * BigInt(option)) / 100n;
    const valueString = formatUnits(value, decimals);
    return {
      value: valueString,
      option,
      isActive: balance !== 0n && currentValue === valueString,
    };
  });
};
