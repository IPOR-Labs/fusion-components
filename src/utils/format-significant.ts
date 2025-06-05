import { formatNumber } from '@/utils/format-number';
import { formatUnits } from 'viem';

/**
 * Formats a bigint amount to a string with specified significant digits
 * @param amount - The amount as bigint
 * @param decimals - Number of decimals for the amount
 * @param significantDigits - Number of significant digits to show (default: 6)
 * @returns Formatted string with specified significant digits
 * @dev formatNumber is used to format the integer part with thousands separator instead of .toLocaleString('en-US') which is not precise for large numbers
 */
export function formatSignificant(
  amount: bigint,
  decimals: number,
  significantDigits: number = 6,
): string {
  if (amount === 0n) return '0.00';
  if (decimals < 0) throw new Error('decimals is less than 0');
  if (significantDigits <= 0)
    throw new Error('significantDigits must be positive');

  if (decimals === 0) return formatNumber(amount, 0, 0);

  const formatted = formatUnits(amount, decimals);

  const [integerPart = '', decimalPart = ''] = formatted.split('.');
  const integerPartFormatted = formatNumber(BigInt(integerPart), 0, 0);

  if (integerPart.length > significantDigits) {
    return integerPartFormatted;
  }

  if (decimalPart === '') {
    return integerPartFormatted;
  }

  if (integerPart !== '0') {
    const visibleDecimalDigits = significantDigits - integerPart.length;
    const formattedDecimalPart = decimalPart.slice(0, visibleDecimalDigits);
    if (formattedDecimalPart === '') {
      return integerPartFormatted;
    }
    return `${integerPartFormatted}.${formattedDecimalPart}`;
  }

  let leadingZeros = 0;

  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] === '0') {
      leadingZeros++;
    } else {
      break;
    }
  }

  const formattedDecimalPart = decimalPart.slice(
    0,
    leadingZeros + significantDigits,
  );
  return `0.${formattedDecimalPart}`;
}
