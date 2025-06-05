import { describe, it, expect, vi } from 'vitest';
import { withRetryTx } from '@/transactions/utils/with-retry-tx';
import type { Hash } from 'viem';

describe('withRetryTx', () => {
  it('when tx succeed do not retry', async () => {
    const SUCCESS = (): Promise<Hash> => Promise.resolve('0x123');
    const txSpy = vi.fn(SUCCESS);

    const txWithRetry = withRetryTx(txSpy);
    await expect(txWithRetry()).resolves.toBe('0x123');
    expect(txSpy).toBeCalledTimes(1);
  });

  it('when tx fails retry 3 times', async () => {
    const FAIL = (): Promise<Hash> => Promise.reject(new Error('ERROR_MSG'));
    const txSpy = vi.fn(FAIL);

    const txWithRetry = withRetryTx(txSpy);
    await expect(txWithRetry()).rejects.toEqual(new Error('ERROR_MSG'));
    expect(txSpy).toBeCalledTimes(3);
  });

  it('when only first tx fails then retry one time', async () => {
    const txSpy = vi
      .fn()
      .mockRejectedValueOnce(new Error('ERROR_MSG'))
      .mockResolvedValueOnce('0x123');

    const txWithRetry = withRetryTx(txSpy);
    await expect(txWithRetry()).resolves.toBe('0x123');
    expect(txSpy).toBeCalledTimes(2);
  });

  it('retry only for specific error message', async () => {
    const txSpy = vi
      .fn()
      .mockRejectedValueOnce(new Error('ERROR_MSG_1'))
      .mockRejectedValueOnce(new Error('ERROR_MSG_2'))
      .mockResolvedValueOnce('0x123');

    const txWithRetry = withRetryTx(txSpy, {
      errorMessages: ['ERROR_MSG_1'],
    });
    await expect(txWithRetry()).rejects.toEqual(new Error('ERROR_MSG_2'));
    expect(txSpy).toBeCalledTimes(2);
  });

  it('rejects for error msg not included in options', async () => {
    const txSpy = vi
      .fn()
      .mockRejectedValueOnce(new Error('ERROR_MSG_1'))
      .mockRejectedValueOnce(new Error('ERROR_MSG_2'))
      .mockRejectedValueOnce(new Error('ERROR_MSG_3'))
      .mockResolvedValueOnce('0x123');

    const txWithRetry = withRetryTx(txSpy, {
      errorMessages: ['ERROR_MSG_1', 'ERROR_MSG_2'],
    });
    await expect(txWithRetry()).rejects.toEqual(new Error('ERROR_MSG_3'));
    expect(txSpy).toBeCalledTimes(3);
  });

  it('resolves if all error msgs included in options', async () => {
    const txSpy = vi
      .fn()
      .mockRejectedValueOnce(new Error('ERROR_MSG_1'))
      .mockRejectedValueOnce(new Error('ERROR_MSG_2'))
      .mockResolvedValueOnce('0x123');

    const txWithRetry = withRetryTx(txSpy, {
      errorMessages: ['ERROR_MSG_1', 'ERROR_MSG_2'],
    });
    await expect(txWithRetry()).resolves.toBe('0x123');
    expect(txSpy).toBeCalledTimes(3);
  });

  it('retry as many times as maxRetryCount', async () => {
    const txSpy_1 = vi
      .fn()
      .mockRejectedValueOnce(new Error('ERROR_MSG'))
      .mockRejectedValueOnce(new Error('ERROR_MSG'))
      .mockRejectedValueOnce(new Error('ERROR_MSG'))
      .mockRejectedValueOnce(new Error('ERROR_MSG'))
      .mockResolvedValueOnce('0x123');

    const txWithRetry_1 = withRetryTx(txSpy_1, {
      errorMessages: ['ERROR_MSG'],
      maxRetryCount: 5,
    });
    await expect(txWithRetry_1()).resolves.toBe('0x123');
    expect(txSpy_1).toBeCalledTimes(5);

    const txSpy_2 = vi
      .fn()
      .mockRejectedValueOnce(new Error('ERROR_MSG_1'))
      .mockRejectedValueOnce(new Error('ERROR_MSG_1'))
      .mockRejectedValueOnce(new Error('ERROR_MSG_1'))
      .mockRejectedValueOnce(new Error('ERROR_MSG_1'))
      .mockRejectedValueOnce(new Error('ERROR_MSG_2'))
      .mockResolvedValueOnce('0x123');

    const txWithRetry_2 = withRetryTx(txSpy_2, {
      errorMessages: ['ERROR_MSG_1'],
      maxRetryCount: 5,
    });
    await expect(txWithRetry_2()).rejects.toEqual(new Error('ERROR_MSG_2'));
    expect(txSpy_1).toBeCalledTimes(5);
  });
});
