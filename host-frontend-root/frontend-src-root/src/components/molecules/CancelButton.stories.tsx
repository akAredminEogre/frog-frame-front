import type { Meta, StoryObj } from '@storybook/react-vite';
import CancelButton from './CancelButton';

const meta: Meta<typeof CancelButton> = {
  title: 'Molecules/CancelButton',
  component: CancelButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
