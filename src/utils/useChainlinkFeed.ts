import { keepPreviousData } from '@tanstack/react-query';
import { BLOCK_INTERVAL } from '@/utils/constants';
import { parseUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { type Address } from 'viem';
import { mainnet } from 'viem/chains';

interface Args {
  assetType: AssetType;
}

const useChainlinkFeed = ({ assetType }: Args) => {
  return useReadContract({
    address: BASE_ASSET_CHAINLINK_ADDRESS[assetType],
    abi: ABI,
    functionName: 'latestRoundData',
    chainId: mainnet.id,
    query: {
      refetchInterval: BLOCK_INTERVAL,
      staleTime: BLOCK_INTERVAL,
      placeholderData: keepPreviousData,
    },
  });
};

export const useChainlinkAssetUsdPrice = ({
  assetType,
  enabled,
}: {
  assetType: AssetType;
  enabled: boolean;
}) => {
  const { data, ...rest } = useChainlinkFeed({ assetType });

  const usdPrice8 = data?.[1];
  const usdPrice18 = convert8To18(usdPrice8);

  return {
    data: usdPrice18,
    ...rest,
  };
};

const ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Chainlink results are 8 decimals, we need 18
const convert8To18 = (value8: bigint | undefined) => {
  if (value8 === undefined) {
    return undefined;
  }

  return parseUnits(value8.toString(), 10);
};

const BASE_ASSET_CHAINLINK_ADDRESS = {
  USDC: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
  USDT: '0x3e7d1eab13ad0104d2750b8863b489d65364e32d',
  DAI: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9',
  ETH: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
  stETH: '0xcfe54b5cd566ab89272946f602d76ea879cab4a8',
  ARB: '0x31697852a68433DbCc2Ff612c516d69E3D9bd08F',
} satisfies Record<string, Address>;

type AssetType = keyof typeof BASE_ASSET_CHAINLINK_ADDRESS;
