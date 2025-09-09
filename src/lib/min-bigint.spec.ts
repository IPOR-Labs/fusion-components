import { it, expect } from 'vitest';
import { minBigInt } from '@/lib/min-bigint';

it('returns max bigint', () => {
  expect(minBigInt(1n, 2n, 3n)).toBe(1n);
  expect(minBigInt(1n)).toBe(1n);
  expect(minBigInt(4n, 3n, 2n, 1n)).toBe(1n);
  expect(minBigInt(4n, 3n, 0n, 2n, 1n)).toBe(0n);
});
