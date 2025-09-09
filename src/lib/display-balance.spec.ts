import { displayBalance } from '@/lib/display-balance';
import { describe, expect, it } from 'vitest';

describe('displayBalance', () => {
  it('should return the balance with the symbol', () => {
    // given
    const balance = 100_000_000_000_000_000_000n;
    const decimals = 18;
    const symbol = 'DAI';

    // when
    const result = displayBalance({ balance, decimals, symbol });

    // then
    expect(result).toBe('100 DAI');
  });

  it('should not display symbol if undefined', () => {
    // given
    const balance = 100_000_000_000_000_000_000n;
    const decimals = 18;
    const symbol = undefined;

    // when
    const result = displayBalance({ balance, decimals, symbol });

    // then
    expect(result).toBe('100');
  });

  it('should display ZERO if decimals is undefined', () => {
    // given
    const balance = 100_000_000_000_000_000_000n;
    const decimals = undefined;
    const symbol = 'USDC';

    // when
    const result = displayBalance({ balance, decimals, symbol });

    // then
    expect(result).toBe('0.00 USDC');
  });

  it('should display ZERO if balance is undefined', () => {
    // given
    const balance = undefined;
    const decimals = 18;
    const symbol = 'USDC';

    // when
    const result = displayBalance({ balance, decimals, symbol });

    // then
    expect(result).toBe('0.00 USDC');
  });
});
