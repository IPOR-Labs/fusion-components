import type { StoryObj, Meta } from '@storybook/react-vite';
import { TransactionFormButtons } from '.';

const meta: Meta<typeof TransactionFormButtons> = {
  component: TransactionFormButtons,
  title: 'Components / TransactionFormButtons',
};
export default meta;

type Story = StoryObj<typeof TransactionFormButtons>;

export const Default: Story = {
  render: (args) => {
    return (
      <div className="bg-ipor-dark-1 border border-white/20">
        <TransactionFormButtons {...args} />
      </div>
    );
  },
  args: {
    chainId: 1,
    isSubmitDisabled: false,
    isWalletConnected: true,
    transactionSubmitButtonText: 'Deposit',
    isWrongWalletChain: false,
    isLoading: false,
    approvalProps: {
      isApproving: false,
      accountAddress: '0xA6A7B66EbBb5CbfDFf3C83781193618ee4E22f4D',
      allowance: 10_000000n,
      decimals: 6,
      needsApproval: false,
      visibleDecimals: 2,
    },
  },
};

export const UpdateApproval: Story = {
  ...Default,
  args: {
    ...Default.args,
    approvalProps: {
      ...Default.args?.approvalProps!,
      needsApproval: true,
    },
  },
};

export const Approve: Story = {
  ...Default,
  args: {
    ...Default.args,
    approvalProps: {
      ...Default.args?.approvalProps!,
      allowance: 0n,
      needsApproval: true,
    },
  },
};

export const Approving: Story = {
  ...Default,
  args: {
    ...Default.args,
    approvalProps: {
      ...Default.args?.approvalProps!,
      isApproving: true,
    },
  },
};

export const Approved: Story = {
  ...Default,
  args: {
    ...Default.args,
    approvalProps: {
      ...Default.args?.approvalProps!,
      allowance: 1000_000000n,
      needsApproval: false,
    },
  },
};

export const NoApproval: Story = {
  ...Default,
  args: {
    ...Default.args,
    approvalProps: undefined,
    transactionSubmitButtonText: 'Withdraw',
  },
};

export const Disconnected: Story = {
  ...Default,
  args: {
    ...Default.args,
    isWalletConnected: false,
  },
};

export const NoApprovalDisconnected: Story = {
  ...NoApproval,
  args: {
    ...NoApproval.args,
    isWalletConnected: false,
  },
};

export const SwitchingChain: Story = {
  ...Default,
  args: {
    ...Default.args,
    isWrongWalletChain: true,
  },
};

export const NoApprovalSwitchingChain: Story = {
  ...NoApproval,
  args: {
    ...NoApproval.args,
    isWrongWalletChain: true,
  },
};

export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    isSubmitDisabled: true,
  },
};

export const DisabledNoApproval: Story = {
  ...NoApproval,
  args: {
    ...NoApproval.args,
    isSubmitDisabled: true,
  },
};

export const InProgress: Story = {
  ...Default,
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const NoApprovalInProgress: Story = {
  ...NoApproval,
  args: {
    ...NoApproval.args,
    isLoading: true,
  },
};
