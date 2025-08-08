import { handleError } from '@/errors/handle-error';
import { throwDappError } from '@/errors/throw-dapp-error';
import { transactionToastAddedToSafeWallet } from '@/transactions/toasts';
import { type TransactionKey, type TransactionStateHandlers } from '@/transactions/types';
import { sleep } from '@/utils/sleep';
import { type Address, type Hash, type PublicClient, type TransactionReceipt } from 'viem';
import { calcSavedGasCost } from '@/transactions/utils/calc-saved-gas-cost';
import { useSetup } from './setup';
import { Schema, z } from 'zod';
import { type WriteContractMutateAsync } from 'wagmi/query';
import { type Config } from 'wagmi';
import { type ChainId } from '@/app/wagmi';

interface WriteAsyncArgs {
  publicClient: PublicClient;
  writeContractAsync: WriteContractMutateAsync<Config, unknown>;
  bypassGasEstimation: boolean;
  accountAddress: Address;
}

interface UseContractWriteTransactionArgs<TSchema extends Schema> {
  writeAsync: (
    args: WriteAsyncArgs,
    payload: z.TypeOf<TSchema>,
  ) => Promise<Hash>;
  transactionKey: TransactionKey;
  chainId: ChainId;
  transactionStateHandlers: TransactionStateHandlers;
  onReceipt?: (receipt: TransactionReceipt) => void;
  enabled?: boolean;
  payloadSchema?: TSchema;
}

export const useContractWriteTransaction = <TSchema extends Schema>({
  writeAsync,
  transactionKey,
  chainId,
  transactionStateHandlers: { onInit, onConfirm, onSuccess, onError },
  onReceipt,
  enabled = true,
  payloadSchema,
}: UseContractWriteTransactionArgs<TSchema>) => {
  const _payloadSchema = payloadSchema || z.undefined();
  const {
    accountAddress,
    isWrongWalletChain,
    publicClient,
    ethPrice,
    addTransaction,
    updateTransaction,
    queryClient,
    getReceipt,
    getTransaction,
    writeContractAsync,
    isSafeWallet,
  } = useSetup({ chainId });

  const execute = async (payload?: z.infer<typeof _payloadSchema>) => {
    let hash: Hash | undefined = undefined;
    try {
      onInit?.();
      if (isWrongWalletChain) {
        return throwDappError('DAPP_WRONG_WALLET_CHAIN');
      }
      if (accountAddress === undefined) {
        return throwDappError('DAPP_NO_WALLET_CONNECTED');
      }
      if (publicClient === undefined) {
        throw new Error('publicClient is undefined');
      }

      /**
       * @dev Safe wallets don't need to wait for a receipt
       * To avoid UX issues, we should await this promise
       */
      if (isSafeWallet) {
        // We don't need the hash for Safe wallets
        // TODO: Promise never resolves
        await writeAsync(
          {
            // @ts-expect-error
            publicClient,
            // @ts-expect-error
            writeContractAsync,
            bypassGasEstimation: true,
            accountAddress,
          },
          payload,
        );

        onConfirm?.();
        transactionToastAddedToSafeWallet();
        onSuccess?.();
        return;
      }

      const _hash = await writeAsync(
        {
          // @ts-expect-error
          publicClient,
          // @ts-expect-error
          writeContractAsync,
          bypassGasEstimation: false,
          accountAddress,
        },
        payload,
      );

      onConfirm?.();
      hash = _hash as Hash;
      addTransaction({
        type: transactionKey,
        hash,
        chainId,
        data: {
          state: 'pending',
        },
      });
      const receipt = await getReceipt(hash);
      onReceipt?.(receipt);

      if (receipt.status === 'reverted') {
        const error = handleError(`TRANSACTION_REVERTED: ${hash}`);
        onError?.(error);
        updateTransaction(hash, {
          state: 'error',
          error,
        });
      }

      if (receipt.status === 'success') {
        const transaction = await getTransaction(hash);
        onSuccess?.();
        queryClient.invalidateQueries();
        await sleep(1000);

        const savedGasCost = calcSavedGasCost({
          gasEstimated: transaction.gas,
          gasPriceBid: transaction.gasPrice,
          gasUsed: receipt.gasUsed,
          gasPricePaid: receipt.effectiveGasPrice,
          // @ts-expect-error
          ethPrice,
        });

        updateTransaction(hash, {
          state: 'success',
          savedGasCost,
        });
      }
    } catch (e) {
      const error = handleError(e);
      onError?.(error);
      if (hash) {
        updateTransaction(hash, {
          state: 'error',
          error,
        });
      }
      throw e;
    }
  };

  return {
    execute: enabled ? execute : undefined,
  };
};
