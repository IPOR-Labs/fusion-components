import { zeroAddress, type Address, isAddress, isAddressEqual } from 'viem';

export const isNonZeroAddress = (
  address: string | undefined,
): address is Address => {
  if (address === undefined) {
    return false;
  }

  if (!isAddress(address)) {
    return false;
  }

  if (isAddressEqual(address, zeroAddress)) {
    return false;
  }

  return true;
};
