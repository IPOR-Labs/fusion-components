import { type MetamaskErrorCode } from '@/errors/types';
import { metamaskErrorsList } from '@/errors/utils';

interface MetamaskError {
  code: number;
  message: string;
}

const isMetamaskError = (error: any): error is MetamaskError => {
  if (
    typeof error === 'object' &&
    error?.message &&
    typeof error.message === 'string' &&
    error?.code &&
    typeof error.code === 'number'
  ) {
    return true;
  }

  return false;
};

export const getCodeFromMetamaskError = (error: unknown) => {
  try {
    /**
     * MetaMask throws errors as non-Error type
     * regular object expected
     */
    if (error instanceof Error) {
      return null;
    }

    if (!isMetamaskError(error)) {
      return null;
    }

    const metamaskErrorCode = `METAMASK_${error.code}` as MetamaskErrorCode;

    if (metamaskErrorCode in metamaskErrorsList) {
      return metamaskErrorCode;
    }

    return null;
  } catch (e) {
    return null;
  }
};
