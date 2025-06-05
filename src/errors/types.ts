import { errorMessagesMap, iporErrorList, metamaskErrorsList } from '@/errors/utils';

export type UserErrorCode = keyof typeof errorMessagesMap;

export interface AppError {
  code: UserErrorCode;
  message: string;
  eventId: string;
  originalError: unknown;
}

export type IporErrorCode = keyof typeof iporErrorList;

export type MetamaskErrorCode = keyof typeof metamaskErrorsList;
