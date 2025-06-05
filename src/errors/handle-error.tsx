import { getAppError } from '@/errors/get-app-error';
import { type AppError } from '@/errors/types';
import { logError } from '@/errors/log-error';

export const handleError = (e: unknown): AppError => {
  const eventId = logError(e);
  const error = getAppError(e, eventId);

  return error;
};
