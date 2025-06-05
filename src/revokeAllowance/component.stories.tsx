import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConnectedDecorator } from '@/utils/storybook';
import { RevokeAllowance } from '.';
import { USDT_ADDRESS } from '@/fusion/markets/erc20/erc20.addresses';
import { mainnet } from 'viem/chains';

const meta: Meta<typeof RevokeAllowance> = {
  title: 'RevokeAllowance',
  component: RevokeAllowance,
};

export default meta;
type Story = StoryObj<typeof RevokeAllowance>;

export const Default: Story = {
  decorators: [ConnectedDecorator],
  args: {
    chainId: mainnet.id,
    spender: '0xe9385eff3f937fcb0f0085da9a3f53d6c2b4fb5f',
    newAllowance: 1000_000000n,
    tokenAddress: USDT_ADDRESS[mainnet.id],
  },
};
