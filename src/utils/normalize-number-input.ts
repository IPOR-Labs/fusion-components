import { allowedNumberRegexOnlyPositive } from '@/utils/regex';

const DEFAULT_MAX_DECIMALS = 18;
const DEFAULT_MAX_LENGTH = 30;

const removeLeadingZeroRecursive = (value: string): string => {
  const [firstDigit, secondDigit, ...restDigits] = value.split('');
  if (firstDigit === '0' && secondDigit && secondDigit !== '.') {
    return removeLeadingZeroRecursive(`${secondDigit}${restDigits.join('')}`);
  }

  return value;
};

const normalizeDecimals = (value: string, maxDecimals: number): string => {
  const [integerPart = '', decimalPart = ''] = value.split('.');

  if (!decimalPart && !value.includes('.')) {
    return integerPart;
  }

  return `${integerPart}.${decimalPart.slice(0, maxDecimals)}`;
};

interface NormalizeNumberInputOptions {
  maxDecimals?: number;
  maxLength?: number;
}

/**
 *
 * @param value numeric string, decimals comma or dot separated
 * @param options
 *   maxDecimals : number of max decimals allowed, outstanding digits are cut
 *   maxLength : number, max length of characters allowed in value string, if exceeded null is returned
 * @returns string with normalized value, null when change should be ignored
 */
export const normalizeNumberInput = (
  value: string,
  options?: NormalizeNumberInputOptions,
): string | null => {
  const { maxLength = DEFAULT_MAX_LENGTH, maxDecimals = DEFAULT_MAX_DECIMALS } =
    options || {};

  if (value === '.') {
    return '0.';
  }

  if (value.length > maxLength) {
    return null;
  }

  if (!allowedNumberRegexOnlyPositive.test(value)) {
    return null;
  }

  const noLeadingZeros = removeLeadingZeroRecursive(value);
  const normalizedDecimals = normalizeDecimals(noLeadingZeros, maxDecimals);

  return normalizedDecimals;
};
