import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ConnectedDecorator,
  PlasmaVaultDecorator,
} from '@/utils/storybook';
import { HybridWithdrawDialog } from './hybrid-withdraw-dialog';
import { mainnet } from 'viem/chains';

const meta: Meta<typeof HybridWithdrawDialog> = {
  title: 'Plasma Vault / HybridWithdrawDialog',
  component: HybridWithdrawDialog,
};

export default meta;

type Story = StoryObj<typeof HybridWithdrawDialog>;

export const Default: Story = {
  decorators: [PlasmaVaultDecorator, ConnectedDecorator],
  args: {
    chainId: mainnet.id,
    plasmaVaultAddress: '0xb530a1b5259a71187f1d69acf0488f102637a3ed',
  },
};
