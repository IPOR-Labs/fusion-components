export const DAPP_ERRORS_LIST = {
  DAPP_USER_REJECTED_REQUEST: {
    message: 'DAPP_USER_REJECTED_REQUEST',
    description: 'User rejected the request.',
  },
  DAPP_DEMAND_TOO_HIGH: {
    message: 'DAPP_DEMAND_TOO_HIGH',
    description:
      'Enso API for Zapping is experiencing high request volume. Please wait and try again or try a manual deposit.',
  },
  DAPP_RESTRICTED_AREA: {
    message: 'DAPP_RESTRICTED_AREA',
    description: "You're accessing IPOR from a restricted area",
  },
  DAPP_NO_WALLET_CONNECTED: {
    message: 'DAPP_NO_WALLET_CONNECTED',
    description: 'No wallet connected to IPOR dapp',
  },
  DAPP_WRONG_WALLET_CHAIN: {
    message: 'DAPP_WRONG_WALLET_CHAIN',
    description: 'Your wallet is connected to wrong chain',
  },
};

export type DappErrorCode = keyof typeof DAPP_ERRORS_LIST;
