import { describe, it, expect } from 'vitest';
import { formatNumber } from '@/utils/format-number';

describe('formatNumber', () => {
  it('format 1.23456 to 1.23 with default params', () => {
    const value = BigInt('123456');
    expect(formatNumber(value, 5)).toBe('1.23');
  });

  it('format 123.444444 to 123.444 - decimals: 3', () => {
    const value = BigInt('123444444');
    expect(formatNumber(value, 6, 3)).toBe('123.444');
  });

  it('format 20000.000 to 20,000.00 - decimals: 2', () => {
    const value = BigInt('20000000');
    expect(formatNumber(value, 3, 2)).toBe('20,000.00');
  });

  it('format 13437.214093 to 13,437 - decimals: 0', () => {
    const value = BigInt('13437214093');
    expect(formatNumber(value, 6, 0)).toBe('13,437');
  });

  it('format 1.444444 to 1.4444 - decimals: 4', () => {
    const value = BigInt('1444444');
    expect(formatNumber(value, 6, 4)).toBe('1.4444');
  });

  it('format 1.555555 to 1.5556 - decimals: 4', () => {
    const value = BigInt('1555555');
    expect(formatNumber(value, 6, 4)).toBe('1.5555');
  });

  it('format 9.999999 to 9.99 - decimals: 2', () => {
    const value = BigInt('9999999');
    expect(formatNumber(value, 6, 2)).toBe('9.99');
  });
});
