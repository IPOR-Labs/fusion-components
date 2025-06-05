import { DAPP_ERRORS_LIST } from '@/errors/dapp-error-list';
import iporErrorListJSON from '@/errors/ipor-error-list.json';

export const iporErrorList = iporErrorListJSON;

export const metamaskErrorsList = {
  METAMASK_4001: {
    message: 'User denied transaction signature',
    description: 'User denied transaction signature',
  },
  METAMASK_4902: {
    message: 'This chain has not been added to MetaMask',
    description: 'This chain has not been added to MetaMask',
  },
};

export const errorMessagesMap = {
  UNEXPECTED_ERROR: {
    message: 'Error occurred.',
    description: 'Error occurred.',
  },
  ...DAPP_ERRORS_LIST,
  ...iporErrorList,
  ...metamaskErrorsList,
};
