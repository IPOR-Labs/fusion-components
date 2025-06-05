import { type UserErrorCode } from '@/errors/types';

export const getCodeFromViemError = (error: unknown): UserErrorCode | null => {
  try {
    if (error instanceof Error) {
      const errorString = error.toString();

      if (errorString.includes('User rejected the request')) {
        return 'DAPP_USER_REJECTED_REQUEST';
      }

      return null;
    }
  } catch (error) {
    return null;
  }

  return null;
};
