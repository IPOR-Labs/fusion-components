import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExternalLink } from '@/components/ExternalLink/ExternalLink';

const meta: Meta<typeof ExternalLink> = {
  title: 'Components/ExternalLink',
  component: ExternalLink,
};
export default meta;

type Story = StoryObj<typeof ExternalLink>;

export const Default: Story = {
  render: (args) => <ExternalLink {...args} />,
  args: {
    children: 'Default External Link',
  },
};
