import type { Meta, StoryObj } from '@storybook/react-vite';
import { ApprovalSteps } from '@/components/ApprovalSteps/ApprovalSteps';

const meta: Meta<typeof ApprovalSteps> = {
  component: ApprovalSteps,
  title: 'Components/ApprovalSteps',
  argTypes: {
    needsApproval: {
      control: 'boolean',
    },
    isApproving: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof ApprovalSteps>;

export const Default: Story = {
  render: (args) => {
    return (
      <div className="w-52">
        <div className="bg-ipor-dark-1 border border-white/20">
          <ApprovalSteps {...args} />
        </div>
      </div>
    );
  },
  args: {
    needsApproval: true,
    isApproving: false,
  },
};
