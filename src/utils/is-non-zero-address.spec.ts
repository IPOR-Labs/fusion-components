import { describe, expect, it } from 'vitest';
import { isNonZeroAddress } from './isNonZeroAddress';
import { zeroAddress } from 'viem';

describe('isNonZeroAddress', () => {
  it('should return false when address is undefined', () => {
    const result = isNonZeroAddress(undefined);

    expect(result).toBe(false);
  });

  it('should return false when address is zero address', () => {
    const result = isNonZeroAddress(zeroAddress);
    expect(result).toBe(false);
  });

  it('should return true when address is not zero address', () => {
    const USDC = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
    const result = isNonZeroAddress(USDC);
    expect(result).toBe(true);
  });

  it('should return false when address is not a valid address', () => {
    const result = isNonZeroAddress('_not_an_address_');
    expect(result).toBe(false);
  });

  it('should return false when address is not a valid address', () => {
    const result = isNonZeroAddress('0x1234567890');
    expect(result).toBe(false);
  });
});
