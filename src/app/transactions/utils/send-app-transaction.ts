import { getGasPrice } from '@/app/transactions/utils/get-gas-price';
import {
  type PublicClient,
  type WalletClient,
  type WriteContractParameters,
  type WriteContractReturnType,
} from 'viem';

interface Args {
  config: {
    publicClient: PublicClient;
    walletClient: WalletClient;
    bypassGasEstimation: boolean;
  };
  parameters: Pick<
    WriteContractParameters,
    'abi' | 'address' | 'args' | 'functionName' | 'account' | 'value'
  >;
}

export const sendAppTransaction = async ({
  config: { publicClient, walletClient, bypassGasEstimation },
  parameters,
}: Args): Promise<WriteContractReturnType> => {
  if (bypassGasEstimation) {
    return await walletClient.writeContract({
      ...parameters,
      chain: publicClient.chain,
    });
  }

  const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice({
    chainId: publicClient.chain?.id,
  });

  const gasEstimate = await publicClient.estimateContractGas({
    ...parameters,
    account: parameters.account ?? undefined,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  
  // extra 10% gas
  const gas = (gasEstimate * 11n) / 10n;

  const { request } = await publicClient.simulateContract({
    ...parameters,
    maxFeePerGas,
    maxPriorityFeePerGas,
    gas,
  });

  return await walletClient.writeContract(request);
};
