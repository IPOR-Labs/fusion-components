import { describe, expect, it } from 'vitest';
import { substrateToAddress } from '@/utils/substrate-to-address';
import { type Hex, isAddress } from 'viem';

describe('should try to convert substrate to address', () => {
  it('with leading zeros', () => {
    /**
     * This is the address of some Harvest vaults on Base with leading zeros
     * Address should be always 20 bytes long
     */
    const harvestBaseVaultSubstrate: Hex =
      '0x00000000000000000000000000f281832f74d3eb391c219148ee3b7c8bb46319';

    const result = substrateToAddress(harvestBaseVaultSubstrate);
    expect(result).not.toBe(undefined);
    expect(isAddress(result!)).toBe(true);
    expect(result).toBe('0x00f281832f74d3eb391c219148ee3b7c8bb46319');
  });

  it('for substrate which is not an address returns undefined', () => {
    /**
     * This is a substrate of some Morpho market on Ethereum
     * That's not an address and should return undefined
     */
    const morphoMarketIdEthereumSubstrate: Hex =
      '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49';

    const result = substrateToAddress(morphoMarketIdEthereumSubstrate);
    expect(result).toBe(undefined);
  });
});
