import { formatUnits } from 'viem';

export const formatNumber = (
  value: bigint,
  decimals: number,
  visibleDecimals = 2,
  thousandSeparator: string | null = ',',
) => {
  const isNegative = value < 0;
  const valueAbsNumber = isNegative ? -value : value;
  const prefix = isNegative ? '-' : '';

  const valueAbsString = formatUnits(valueAbsNumber, decimals);

  const [int = '0', decimalFraction = '0'] = valueAbsString.split('.');
  const formattedInt = int
    .split('')
    .reverse()
    .flatMap((digit, index) => {
      if (!thousandSeparator) {
        return digit;
      }

      if (index === 0 || index % 3) {
        return digit;
      }

      return [',', digit];
    })
    .reverse()
    .join('');
  const formattedDecimalFraction = decimalFraction
    .slice(0, visibleDecimals)
    .padEnd(visibleDecimals, '0');

  if (formattedDecimalFraction) {
    return `${prefix}${formattedInt}.${formattedDecimalFraction}`;
  }

  return `${prefix}${formattedInt}`;
};
