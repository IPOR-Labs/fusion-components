import { type IporErrorCode } from '@/errors/types';
import { iporErrorList } from '@/errors/utils';

const getErrorString = (error: unknown): string | null => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.toString();
  }

  if (!!error && typeof error === 'object') {
    return JSON.stringify(error);
  }

  return null;
};

export const getCodeFromIporError = (error: unknown) => {
  try {
    const errorString = getErrorString(error);

    if (!errorString) {
      return null;
    }

    const exp = /IPOR_[0-9]{3}/g;
    const result = errorString.match(exp);

    if (result) {
      const [code] = result;

      if (code) {
        if (iporErrorList[code as IporErrorCode]) {
          return code as IporErrorCode;
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};
