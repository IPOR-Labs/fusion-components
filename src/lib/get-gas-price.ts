import { getGasPriceBlockNative } from '@/lib/get-gas-price-block-native';
import { mainnet } from 'wagmi/chains';

const DEFAULT_GAS_CONFIDENCE = 70;

interface Args {
  chainId: number | undefined;
}

export const getGasPrice = async ({ chainId }: Args) => {
  let maxPriorityFeePerGas: bigint | undefined = undefined;
  let maxFeePerGas: bigint | undefined = undefined;

  if (chainId === mainnet.id) {
    try {
      const bnGasForTransaction = await getGasPriceBlockNative();
      const gasPriceEstimate =
        bnGasForTransaction[0]?.blockPrices[0]?.estimatedPrices.find(
          ({ confidence }) => confidence === DEFAULT_GAS_CONFIDENCE,
        );
      maxPriorityFeePerGas = gasPriceEstimate
        ? gweiToWeiHex(gasPriceEstimate.maxPriorityFeePerGas)
        : undefined;
      maxFeePerGas = gasPriceEstimate
        ? gweiToWeiHex(gasPriceEstimate.maxFeePerGas)
        : undefined;
    } catch (error) {
      maxPriorityFeePerGas = undefined;
      maxFeePerGas = undefined;
    }
  }

  return {
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
};

const gweiToWeiHex = (gwei: number | null) => {
  if (!gwei) {
    return undefined;
  }

  return BigInt(gwei * 1e9);
};
