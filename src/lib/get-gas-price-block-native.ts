import gas from '@web3-onboard/gas';
import { toHex } from 'viem';
import { mainnet } from 'wagmi/chains';

const BLOCK_NATIVE_API_KEY = 'd8830118-0cfd-4020-baa9-63bdff095cde';

export const getGasPriceBlockNative = async () => {
  return await gas.get({
    chains: [toHex(mainnet.id)],
    apiKey: BLOCK_NATIVE_API_KEY,
    endpoint: 'blockPrices',
  });
};
