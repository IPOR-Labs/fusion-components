import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { zeroAddress, type Hash, type TransactionReceipt } from 'viem';
import { TransactionFeedback } from './transaction-feedback';
import { ConfigProvider } from '@/app/config/config.context';
import { mainnet } from 'viem/chains';

const EXAMPLE_HASH = (`0x${'a'.repeat(64)}`) as Hash;

const withTransactionFeedback: Decorator = (Story) => {
  return (
    <ConfigProvider config={{
      chainId: mainnet.id,
      fusionVaultAddress: zeroAddress,
    }}>
      <Story />
    </ConfigProvider>
  );
};

const meta = {
  component: TransactionFeedback,
  tags: ['autodocs'],
  decorators: [withTransactionFeedback],
} satisfies Meta<typeof TransactionFeedback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IdleState: Story = {
  args: {
    transactionState: {
      txStatus: {
        type: 'idle',
      },
      transactionStateHandlers: {},
      resetTransactionState: () => { },
    }
  },
};

export const PendingState: Story = {
  args: {
    transactionState: {
      txStatus: {
        type: 'pending',
        hash: EXAMPLE_HASH,
      },
      transactionStateHandlers: {},
      resetTransactionState: () => { },
    },
  },
};

export const SuccessState: Story = {
  args: {
    transactionState: {
      txStatus: {
        type: 'success',
        hash: EXAMPLE_HASH,
        receipt: {} as TransactionReceipt,
      },
      transactionStateHandlers: {},
      resetTransactionState: () => { },
    },
  },
};

export const ErrorState: Story = {
  args: {
    transactionState: {
      txStatus: {
        type: 'error',
        error: new Error('Example error'),
        hash: undefined,
        receipt: undefined,
      },
      transactionStateHandlers: {},
      resetTransactionState: () => { },
    },
  },
};


