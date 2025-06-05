import { type DappErrorCode } from '@/errors/dapp-error-list';

export const throwDappError = (errorCode: DappErrorCode): void => {
  throw new Error(errorCode);
};
