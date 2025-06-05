import { describe, it, expect } from 'vitest';
import { calcSavedGasCost } from '@/transactions/utils/calc-saved-gas-cost';
import { formatEther, parseEther } from 'viem';

describe('calcSavedGasCost', () => {
  // https://sepolia.arbiscan.io/tx/0xff7a19fc9861e4982bbe5093cf758712bc63dd4e2716fcaaafe6cda25db16ee8
  it('Should return saved gas cost amount in USD', () => {
    const result = calcSavedGasCost({
      gasEstimated: 223265n,
      gasPriceBid: parseEther('0.00000000338747'),
      gasUsed: 205000n,
      gasPricePaid: parseEther('0.00000000188747'),
      ethPrice: parseEther('3637.59'),
    });

    const expected = 1343624401105684500n;

    expect(formatEther(result!)).toEqual(formatEther(expected));
    expect(result).toEqual(expected);
  });
});
