import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ConnectedDecorator,
  PlasmaVaultDecorator,
} from '@/utils/storybook';
import { DepositDialog } from '@/fusion/deposit/deposit-asset/deposit-asset';
import { arbitrum } from 'viem/chains';

const meta: Meta<typeof DepositDialog> = {
  title: 'Plasma Vault / DepositDialog',
  component: DepositDialog,
};

export default meta;

type Story = StoryObj<typeof DepositDialog>;

export const Default: Story = {
  decorators: [PlasmaVaultDecorator, ConnectedDecorator],
  args: {
    chainId: arbitrum.id,
    plasmaVaultAddress: '0x227de061fc17639db0747d0fbd71c3c2a195770d',
  },
};
