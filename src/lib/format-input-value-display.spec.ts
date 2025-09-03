import { expect, it } from 'vitest';
import { formatInputValueDisplay } from '@/lib/format-input-value-display';

it('formatInputValueDisplay', () => {
  expect(formatInputValueDisplay('')).toBe('');
  expect(formatInputValueDisplay('.')).toBe('0.');
  expect(formatInputValueDisplay('0')).toBe('0');
  expect(formatInputValueDisplay('1000')).toBe('1,000');
  expect(formatInputValueDisplay('2000.9')).toBe('2,000.9');
  expect(formatInputValueDisplay('2000.01')).toBe('2,000.01');
  expect(formatInputValueDisplay('3000.00001')).toBe('3,000.00001');
  expect(formatInputValueDisplay('4500600.00001')).toBe('4,500,600.00001');
  expect(formatInputValueDisplay('600700400500600.00001')).toBe(
    '600,700,400,500,600.00001',
  );
  expect(formatInputValueDisplay('.00007')).toBe('0.00007');
  expect(formatInputValueDisplay('5000.')).toBe('5,000.');
  expect(formatInputValueDisplay('0.00')).toBe('0.00');
  expect(formatInputValueDisplay('0000.00')).toBe('0.00');
  expect(formatInputValueDisplay('0001.')).toBe('1.');
  expect(formatInputValueDisplay('00083')).toBe('83');
});