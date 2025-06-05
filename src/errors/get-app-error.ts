import { getCodeFromDappError } from '@/errors/get-code-from-dapp-error';
import { getCodeFromIporError } from '@/errors/get-code-from-ipor-error';
import { getCodeFromMetamaskError } from '@/errors/get-code-from-metamask-error';
import { getCodeFromViemError } from '@/errors/get-code-from-viem-error';
import { type AppError, type UserErrorCode } from '@/errors/types';
import { errorMessagesMap } from '@/errors/utils';

const getErrorCode = (error: unknown): UserErrorCode => {
  /**
   * App errors expected here
   */
  const appErrorCode = getCodeFromDappError(error);
  if (appErrorCode) {
    return appErrorCode;
  }

  /**
   * Transaction errors expected here
   * eg. RPC Error, when transaction reverted
   */
  const iporErrorCode = getCodeFromIporError(error);
  if (iporErrorCode) {
    return iporErrorCode;
  }

  /**
   * MetaMask errors expected here
   * Non contract related errors
   * eg. user reject transaction
   */
  const metamaskErrorCode = getCodeFromMetamaskError(error);
  if (metamaskErrorCode) {
    return metamaskErrorCode;
  }

  /**
   * viem errors
   */
  const viemErrorCode = getCodeFromViemError(error);
  if (viemErrorCode) {
    return viemErrorCode;
  }

  if (error instanceof TypeError) {
    return 'UNEXPECTED_ERROR';
  }

  return 'UNEXPECTED_ERROR';
};

export const getAppError = (error: unknown, eventId: LogEventId): AppError => {
  const code = getErrorCode(error);
  const message = errorMessagesMap[code].description;

  return {
    code,
    message,
    eventId,
    originalError: error,
  };
};
