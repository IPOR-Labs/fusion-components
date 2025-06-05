import { sleep } from '@/utils/sleep';
import { type Hash } from 'viem';

type Tx = Promise<Hash>;

interface Options {
  errorMessages?: string[];
  maxRetryCount?: number;
  retryInterval?: number;
}

export const withRetryTx = (
  txCall: () => Tx,
  options: Options = {},
): (() => Tx) => {
  let retryCount = 0;
  const errorMessages = options.errorMessages || [];
  const maxRetryCount = options.maxRetryCount || 3;
  const retryInterval = options.retryInterval || 0;

  const retry = async (): Tx => {
    try {
      return await txCall();
    } catch (error) {
      retryCount++;

      if (retryCount >= maxRetryCount) {
        throw error;
      }

      if (errorMessages.length > 0) {
        if (error instanceof Error && errorMessages.includes(error.message)) {
          await sleep(retryInterval);
          return await retry();
        }

        throw error;
      }

      await sleep(retryInterval);
      return await retry();
    }
  };

  return retry;
};
