import { getGasPrice } from '@/utils/getGasPrice';
import {
  type PublicClient,
  type WriteContractParameters,
  type WriteContractReturnType,
} from 'viem';
import { type Config } from 'wagmi';
import { type WriteContractMutateAsync } from 'wagmi/query';

interface Args {
  config: {
    publicClient: PublicClient;
    writeContractAsync: WriteContractMutateAsync<Config, unknown>;
    bypassGasEstimation: boolean;
  };
  parameters: Pick<
    WriteContractParameters,
    'abi' | 'address' | 'args' | 'functionName' | 'account' | 'value'
  >;
}

export const sendAppTransaction = async ({
  config: { publicClient, writeContractAsync, bypassGasEstimation },
  parameters,
}: Args): Promise<WriteContractReturnType> => {
  if (bypassGasEstimation) {
    return await writeContractAsync(parameters);
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
  const gas = (gasEstimate * 11n) / 10n;

  const { request } = await publicClient.simulateContract({
    ...parameters,
    maxFeePerGas,
    maxPriorityFeePerGas,
    gas,
  });

  return await writeContractAsync(request);
};
