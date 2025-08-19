import { type TransactionStateHandlers } from './transactions.types';
import { type Address, type Hash, type TransactionReceipt, type WalletClient } from 'viem';
import { Schema, z } from 'zod';
import { usePublicClient } from 'wagmi';
import { type ChainId } from '@/app/wagmi';
import { useAppContext } from '@/app/app.context';
import { useIsSafeWallet } from '@/app/wallet/hooks/use-is-safe-wallet';
import { useIsWrongWalletChain } from '@/app/wallet/hooks';

interface WriteAsyncArgs {
  publicClient: ReturnType<typeof usePublicClient>;
  walletClient: WalletClient;
  bypassGasEstimation: boolean;
  accountAddress: Address;
}

interface UseContractWriteTransactionArgs<TSchema extends Schema> {
  writeAsync: (
    args: WriteAsyncArgs,
    payload: z.TypeOf<TSchema>,
  ) => Promise<Hash>;
  chainId: ChainId;
  transactionStateHandlers: TransactionStateHandlers;
  enabled?: boolean;
  payloadSchema?: TSchema;
}

export const useContractWriteTransaction = <TSchema extends Schema>({
  writeAsync,
  chainId,
  transactionStateHandlers: { onInit, onConfirm, onSuccess, onError },
  enabled = true,
  payloadSchema,
}: UseContractWriteTransactionArgs<TSchema>) => {
  const { walletClient } = useAppContext();
  const _payloadSchema = payloadSchema || z.undefined();
  const publicClient = usePublicClient({ chainId });
  const accountAddress = walletClient?.account?.address;
  const isWrongWalletChain = useIsWrongWalletChain(chainId);
  const isSafeWallet = useIsSafeWallet();

  const execute = async (payload?: z.infer<typeof _payloadSchema>) => {
    let hash: Hash | undefined = undefined;
    let receipt: TransactionReceipt | undefined = undefined;

    try {
      onInit?.();
      if (isWrongWalletChain) {
        throw new Error('Wrong wallet chain');
      }
      if (accountAddress === undefined) {
        throw new Error('No wallet connected');
      }
      if (walletClient === undefined) {
        throw new Error('No wallet connected');
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
        // Promise never resolves
        await writeAsync(
          {
            publicClient,
            walletClient,
            bypassGasEstimation: true,
            accountAddress,
          },
          payload,
        );

        return;
      }

      hash = await writeAsync(
        {
          publicClient,
          walletClient,
          bypassGasEstimation: false,
          accountAddress,
        },
        payload,
      );

      onConfirm?.({ hash });

      receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (receipt.status === 'reverted') {
        throw new Error(`transaction reverted: ${hash}`);
      }

      if (receipt.status === 'success') {
        onSuccess?.({ receipt, hash });
      }
    } catch (e) {
      onError?.({ error: e, hash, receipt });
      throw e;
    }
  };

  return {
    execute: enabled ? execute : undefined,
  };
};
