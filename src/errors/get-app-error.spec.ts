import { expect, it, describe } from 'vitest';
import { getAppError } from '@/errors/get-app-error';
import { TEST_LOG_EVENT_ID } from '@/errors/mocks';

describe('getAppError', () => {
  it('returns UNEXPECTED_ERROR if a TypeError is thrown', () => {
    const error = new TypeError('undefined is not a function');
    expect(getAppError(error, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": [TypeError: undefined is not a function],
      }
    `);
  });

  it('returns UNEXPECTED_ERROR if any unexpected value is thrown', () => {
    expect(getAppError(undefined, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": undefined,
      }
    `);
    expect(getAppError(1, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": 1,
      }
    `);
    expect(getAppError('', TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": "",
      }
    `);
    expect(getAppError('some random string', TEST_LOG_EVENT_ID))
      .toMatchInlineSnapshot(`
        {
          "code": "UNEXPECTED_ERROR",
          "eventId": "__TEST_LOG_EVENT_ID__",
          "message": "Error occurred.",
          "originalError": "some random string",
        }
      `);
    expect(getAppError(null, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": null,
      }
    `);
    expect(getAppError([], TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": [],
      }
    `);
    expect(getAppError({}, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": {},
      }
    `);
    expect(getAppError(new Error(), TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": [Error],
      }
    `);
  });

  // METAMASK ERRORS

  it('MetaMask error must contain string message', () => {
    const noMessageError = {
      code: 4001,
    };
    expect(getAppError(noMessageError, TEST_LOG_EVENT_ID))
      .toMatchInlineSnapshot(`
        {
          "code": "UNEXPECTED_ERROR",
          "eventId": "__TEST_LOG_EVENT_ID__",
          "message": "Error occurred.",
          "originalError": {
            "code": 4001,
          },
        }
      `);

    const noStringMessageError = {
      code: 4001,
      message: 0,
    };
    expect(getAppError(noStringMessageError, TEST_LOG_EVENT_ID))
      .toMatchInlineSnapshot(`
        {
          "code": "UNEXPECTED_ERROR",
          "eventId": "__TEST_LOG_EVENT_ID__",
          "message": "Error occurred.",
          "originalError": {
            "code": 4001,
            "message": 0,
          },
        }
      `);

    const unsupportedErrorNumber = {
      code: 99999999,
      message: 'some message',
    };
    expect(getAppError(unsupportedErrorNumber, TEST_LOG_EVENT_ID))
      .toMatchInlineSnapshot(`
        {
          "code": "UNEXPECTED_ERROR",
          "eventId": "__TEST_LOG_EVENT_ID__",
          "message": "Error occurred.",
          "originalError": {
            "code": 99999999,
            "message": "some message",
          },
        }
      `);
  });

  it('returns METAMASK_4001 if user denies transaction signature', () => {
    const error = {
      code: 4001,
      message: 'MetaMask Tx Signature: User denied transaction signature.',
    };
    expect(getAppError(error, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "METAMASK_4001",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "User denied transaction signature",
        "originalError": {
          "code": 4001,
          "message": "MetaMask Tx Signature: User denied transaction signature.",
        },
      }
    `);
  });

  it('returns METAMASK_4902 if chain is not added (for public testnets)', () => {
    const error = {
      code: 4902,
      message: 'MetaMask Error',
    };
    expect(getAppError(error, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "METAMASK_4902",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "This chain has not been added to MetaMask",
        "originalError": {
          "code": 4902,
          "message": "MetaMask Error",
        },
      }
    `);
  });

  // IPOR ERRORS

  it('returns IPOR_324 for object with some code', () => {
    const onlyStringMessageError = {
      data: {
        message: 'execution reverted: IPOR_324',
      },
    };
    expect(getAppError(onlyStringMessageError, TEST_LOG_EVENT_ID))
      .toMatchInlineSnapshot(`
        {
          "code": "IPOR_324",
          "eventId": "__TEST_LOG_EVENT_ID__",
          "message": "SPREAD_EMVAR_CANNOT_BE_HIGHER_THAN_ONE",
          "originalError": {
            "data": {
              "message": "execution reverted: IPOR_324",
            },
          },
        }
      `);
  });

  it('returns UNEXPECTED_ERROR when unsupported IPOR error number', () => {
    const unsupportedIporErrorNumber = {
      code: -32603,
      message: 'Internal JSON-RPC error.',
      data: {
        code: 3,
        message: 'execution reverted: IPOR_999', // assuming 999 is unsupported
        data: '0x',
      },
    };
    expect(getAppError(unsupportedIporErrorNumber, TEST_LOG_EVENT_ID))
      .toMatchInlineSnapshot(`
        {
          "code": "UNEXPECTED_ERROR",
          "eventId": "__TEST_LOG_EVENT_ID__",
          "message": "Error occurred.",
          "originalError": {
            "code": -32603,
            "data": {
              "code": 3,
              "data": "0x",
              "message": "execution reverted: IPOR_999",
            },
            "message": "Internal JSON-RPC error.",
          },
        }
      `);
  });

  it('returns IPOR_320 for object with code inside', () => {
    const error = {
      code: -32603,
      message: 'Internal JSON-RPC error.',
      data: {
        code: 3,
        message: 'execution reverted: IPOR_320',
        data: '0x',
      },
    };
    expect(getAppError(error, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "IPOR_320",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Swap can not be closed due to low liquidity in the pool",
        "originalError": {
          "code": -32603,
          "data": {
            "code": 3,
            "data": "0x",
            "message": "execution reverted: IPOR_320",
          },
          "message": "Internal JSON-RPC error.",
        },
      }
    `);
  });

  it('returns IPOR_408 error for error-type error with only code passed to constructor as string', () => {
    expect(getAppError(new Error('IPOR_408'), TEST_LOG_EVENT_ID))
      .toMatchInlineSnapshot(`
        {
          "code": "IPOR_408",
          "eventId": "__TEST_LOG_EVENT_ID__",
          "message": "STANLEY_BALANCE_IS_EMPTY",
          "originalError": [Error: IPOR_408],
        }
      `);
  });

  it('returns IPOR_408 error for string with error code', () => {
    expect(getAppError('IPOR_408', TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "IPOR_408",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "STANLEY_BALANCE_IS_EMPTY",
        "originalError": "IPOR_408",
      }
    `);
    expect(getAppError('error: IPOR_408_some random text', TEST_LOG_EVENT_ID))
      .toMatchInlineSnapshot(`
        {
          "code": "IPOR_408",
          "eventId": "__TEST_LOG_EVENT_ID__",
          "message": "STANLEY_BALANCE_IS_EMPTY",
          "originalError": "error: IPOR_408_some random text",
        }
      `);
  });

  it('returns UNEXPECTED_ERROR when code has incorrect format', () => {
    expect(getAppError('IPOR 408', TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": "IPOR 408",
      }
    `);
    expect(getAppError('IPOR:408', TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": "IPOR:408",
      }
    `);
    expect(getAppError('ipor_408', TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": "ipor_408",
      }
    `);
    expect(getAppError('408', TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": "408",
      }
    `);
    expect(getAppError('IPOR_', TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "UNEXPECTED_ERROR",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "Error occurred.",
        "originalError": "IPOR_",
      }
    `);
  });

  // DAPP ERRORS

  it('returns DAPP_NO_SIGNER', () => {
    const error = new Error('DAPP_NO_WALLET_CONNECTED');
    expect(getAppError(error, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "DAPP_NO_WALLET_CONNECTED",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "No wallet connected to IPOR dapp",
        "originalError": [Error: DAPP_NO_WALLET_CONNECTED],
      }
    `);
  });

  // OTHER

  it('returns DAPP_USER_REJECTED_REQUEST', () => {
    const error = new Error('User rejected the request');
    expect(getAppError(error, TEST_LOG_EVENT_ID)).toMatchInlineSnapshot(`
      {
        "code": "DAPP_USER_REJECTED_REQUEST",
        "eventId": "__TEST_LOG_EVENT_ID__",
        "message": "User rejected the request.",
        "originalError": [Error: User rejected the request],
      }
    `);
  });
});
