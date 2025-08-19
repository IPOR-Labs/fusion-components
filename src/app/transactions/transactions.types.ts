import type { Hash, TransactionReceipt } from "viem";

export interface TransactionMessages {
  pending: string;
  success: string;
  error: string;
};

export type TransactionStateHandlers = {
  onInit?: () => void;
  onConfirm?: ({ hash }: { hash: Hash }) => void;
  onSuccess?: ({ receipt, hash }: {
    receipt: TransactionReceipt;
    hash: Hash;
  }) => void;
  onError?: ({ error, hash, receipt }: {
    error: unknown;
    hash: Hash | undefined;
    receipt: TransactionReceipt | undefined;
  }) => void;
};

export type AppError = unknown;
