import { describe, it, expect } from 'vitest';
import { formatSignificant } from '@/utils/format-significant';

describe('formatSignificant', () => {
  it('should handle zero', () => {
    expect(formatSignificant(0n, 18)).toBe('0.00');
  });

  it('should throw error for invalid inputs', () => {
    expect(() => formatSignificant(123n, -1, 2)).toThrow(
      'decimals is less than 0',
    );
    expect(() => formatSignificant(123n, 2, 0)).toThrow(
      'significantDigits must be positive',
    );
    expect(() => formatSignificant(123n, 2, -1)).toThrow(
      'significantDigits must be positive',
    );
  });

  it('should format whole numbers correctly', () => {
    expect(formatSignificant(12345n, 0, 3)).toBe('12,345');
    expect(formatSignificant(1000n, 0, 4)).toBe('1,000');
    expect(formatSignificant(1234n, 0, 2)).toBe('1,234');
  });

  it('should format decimal numbers correctly', () => {
    expect(formatSignificant(123456n, 6, 3)).toBe('0.123');
    expect(formatSignificant(1234n, 4, 2)).toBe('0.12');
    expect(formatSignificant(123456789n, 8, 3)).toBe('1.23');
  });

  it('should handle trailing zeros correctly', () => {
    expect(formatSignificant(1000000n, 6, 4)).toBe('1');
    expect(formatSignificant(1200000n, 6, 4)).toBe('1.2');
    expect(formatSignificant(1230000n, 6, 4)).toBe('1.23');
  });

  it('should respect significant digits parameter', () => {
    expect(formatSignificant(123456789n, 8, 3)).toBe('1.23');
    expect(formatSignificant(123456789n, 8, 4)).toBe('1.234');
    expect(formatSignificant(123456789n, 8, 5)).toBe('1.2345');
  });

  it('should handle very small numbers correctly', () => {
    expect(formatSignificant(1n, 9, 1)).toBe('0.000000001');
    expect(formatSignificant(1234n, 12, 4)).toBe('0.000000001234');
  });

  it('should handle very large numbers', () => {
    expect(formatSignificant(123456789n, 0, 3)).toBe('123,456,789');
    expect(formatSignificant(1000000000n, 0, 3)).toBe('1,000,000,000');
  });

  it('should handle numbers with exact significant digits', () => {
    expect(formatSignificant(123456n, 5, 3)).toBe('1.23');
    expect(formatSignificant(100000n, 5, 1)).toBe('1');
    expect(formatSignificant(100000n, 5, 2)).toBe('1');
  });

  it('should handle numbers with leading zeros in decimal part', () => {
    expect(formatSignificant(1n, 5, 3)).toBe('0.00001');
    expect(formatSignificant(10n, 5, 3)).toBe('0.0001');
    expect(formatSignificant(100n, 5, 3)).toBe('0.001');
  });

  it('should handle edge cases with large significant digits', () => {
    expect(formatSignificant(123456789n, 5, 10)).toBe('1,234.56789');
    expect(formatSignificant(100000000n, 5, 10)).toBe('1,000');
  });

  it('should handle zero decimal places', () => {
    expect(formatSignificant(123456n, 0, 2)).toBe('123,456');
    expect(formatSignificant(100n, 0, 1)).toBe('100');
    expect(formatSignificant(999n, 0, 3)).toBe('999');
  });

  it('should handle maximum safe decimals', () => {
    expect(formatSignificant(1n, 77, 1)).toBe('0.' + '0'.repeat(76) + '1');
    expect(formatSignificant(10n, 77, 1)).toBe('0.' + '0'.repeat(75) + '1');
  });

  it('should handle boundary cases for decimal places', () => {
    expect(formatSignificant(9999999n, 5, 2)).toBe('99');
    expect(formatSignificant(9999999n, 5, 3)).toBe('99.9');
    expect(formatSignificant(10000000n, 5, 2)).toBe('100');
  });

  it('should handle rounding edge cases', () => {
    expect(formatSignificant(1000n, 3, 1)).toBe('1');
    expect(formatSignificant(1100n, 3, 2)).toBe('1.1');
    expect(formatSignificant(1110n, 3, 3)).toBe('1.11');
  });

  it('should handle various zero cases', () => {
    expect(formatSignificant(0n, 5, 1)).toBe('0.00');
    expect(formatSignificant(0n, 0, 5)).toBe('0.00');
    expect(formatSignificant(0n, 18, 10)).toBe('0.00');
  });

  it('should handle large integer parts', () => {
    expect(formatSignificant(123456789123456789n, 0, 5)).toBe(
      '123,456,789,123,456,789',
    );
    expect(formatSignificant(123456789123456789n, 2, 5)).toBe(
      '1,234,567,891,234,567',
    );
  });

  it('should maintain precision for numbers close to significant digits', () => {
    expect(formatSignificant(100001n, 5, 6)).toBe('1.00001');
    expect(formatSignificant(100010n, 5, 6)).toBe('1.0001');
    expect(formatSignificant(100100n, 5, 6)).toBe('1.001');
  });

  it('should handle consecutive zeros in different positions', () => {
    expect(formatSignificant(100100n, 6, 4)).toBe('0.1001');
    expect(formatSignificant(100000n, 6, 4)).toBe('0.1');
    expect(formatSignificant(101000n, 6, 4)).toBe('0.101');
  });
});
