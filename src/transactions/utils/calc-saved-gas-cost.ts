import { ONE_ETHER } from '@/utils/constants';

interface Params {
  gasEstimated: bigint;
  gasPriceBid: bigint | undefined;
  gasUsed: bigint;
  gasPricePaid: bigint;
  ethPrice: bigint | undefined;
}

export const calcSavedGasCost = (params: Params): bigint | undefined => {
  const { gasEstimated, gasUsed, gasPriceBid, gasPricePaid, ethPrice } = params;

  if (ethPrice === undefined || gasPriceBid === undefined) {
    return undefined;
  }

  const savedGasCost =
    ((gasEstimated * gasPriceBid - gasUsed * gasPricePaid) * ethPrice) /
    ONE_ETHER;
  return savedGasCost;
};
