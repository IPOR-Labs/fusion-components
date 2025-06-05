import type { Meta, StoryObj } from '@storybook/react-vite';
import { Capacity } from './capacity';

const meta: Meta<typeof Capacity> = {
  title: 'Components / Capacity',
  component: Capacity,
};
export default meta;

type Story = StoryObj<typeof Capacity>;

export const Default: Story = {
  render: (args) => {
    return (
      <div className="w-full max-w-md">
        <Capacity {...args} />
      </div>
    );
  },
  args: {
    current: 1500_000000n,
    max: 5000_000000n,
    currentLabel: 'To withdraw',
    maxLabel: 'Max instant withdraw',
    howMuchLeftLabel: 'left to be withdrawn instantly',
    symbol: 'USDC',
    decimals: 6,
    significantDecimals: 3,
  },
};
