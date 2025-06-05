import { describe, it, expect } from 'vitest';
import { normalizeNumberInput } from '@/utils/normalize-number-input';

describe('normalizeNumberInput', () => {
  it('returns zero for empty string provided', () => {
    expect(normalizeNumberInput('')).toBe('');
  });

  it('returns 0. for only dot provided', () => {
    expect(normalizeNumberInput('.')).toBe('0.');
  });

  it('returns null for negative numbers', () => {
    expect(normalizeNumberInput('-1')).toBe(null);
  });

  it('returns the value for decimal numbers', () => {
    expect(normalizeNumberInput('5.')).toBe('5.');
    expect(normalizeNumberInput('0.')).toBe('0.');
    expect(normalizeNumberInput('0.0')).toBe('0.0');
    expect(normalizeNumberInput('0.00')).toBe('0.00');
    expect(normalizeNumberInput('0.005')).toBe('0.005');
  });

  it('returns null for multiple decimal points', () => {
    expect(normalizeNumberInput('8.32.')).toBe(null);
  });

  it('removes leading zeros', () => {
    expect(normalizeNumberInput('00')).toBe('0');
    expect(normalizeNumberInput('00.')).toBe('0.');
    expect(normalizeNumberInput('00.0')).toBe('0.0');
    expect(normalizeNumberInput('00.00001')).toBe('0.00001');
    expect(normalizeNumberInput('05.0')).toBe('5.0');
    expect(normalizeNumberInput('0543.9')).toBe('543.9');
    expect(normalizeNumberInput('0000001')).toBe('1');
    expect(normalizeNumberInput('00000543.9')).toBe('543.9');
    expect(normalizeNumberInput('0000300.00002')).toBe('300.00002');
  });

  it('normalizes max decimals', () => {
    expect(normalizeNumberInput('0.1234', { maxDecimals: 2 })).toBe('0.12');
    expect(normalizeNumberInput('1.1234', { maxDecimals: 2 })).toBe('1.12');
    expect(normalizeNumberInput('1300100.1234231', { maxDecimals: 5 })).toBe(
      '1300100.12342',
    );
  });

  it('does not allow letters and special characters, returns null', () => {
    expect(normalizeNumberInput('0.1234e')).toBe(null);
    expect(normalizeNumberInput('1.12e+34')).toBe(null);
    expect(normalizeNumberInput('undefined')).toBe(null);
    expect(normalizeNumberInput('undefined.31')).toBe(null);
    expect(normalizeNumberInput('~31')).toBe(null);
    expect(normalizeNumberInput('+31')).toBe(null);
    expect(normalizeNumberInput('-31')).toBe(null);
  });

  it('returns null if max lenght exceeded', () => {
    expect(normalizeNumberInput('1234567890123456', { maxLength: 15 })).toBe(
      null,
    );
    expect(normalizeNumberInput('543.00001', { maxLength: 4 })).toBe(null);
    expect(normalizeNumberInput('12345', { maxLength: 4 })).toBe(null);
    expect(normalizeNumberInput('12345', { maxLength: 6 })).toBe('12345');
    expect(normalizeNumberInput('123.4', { maxLength: 6 })).toBe('123.4');
  });
});
