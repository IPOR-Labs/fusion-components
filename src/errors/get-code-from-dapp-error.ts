import { DAPP_ERRORS_LIST, type DappErrorCode } from '@/errors/dapp-error-list';

export const getCodeFromDappError = (error: unknown) => {
  try {
    if (error instanceof Error) {
      const errorString = error.toString();

      const exp = /DAPP_[A-Z_]{3,}/g;
      const result = errorString.match(exp);

      if (result) {
        const [code] = result;

        if (code) {
          if (DAPP_ERRORS_LIST[code as DappErrorCode]) {
            return code as DappErrorCode;
          }
        }
      }

      return null;
    }
  } catch (error) {
    return null;
  }

  return null;
};
