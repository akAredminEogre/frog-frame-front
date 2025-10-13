import type { Meta, StoryObj } from '@storybook/react-vite';
import SaveButton from './SaveButton';

const meta: Meta<typeof SaveButton> = {
  title: 'Molecules/SaveButton',
  component: SaveButton,
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
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
