import type { Meta, StoryObj } from '@storybook/react-vite';

import { EmptyStateMessage } from 'src/components/organisms/EmptyStateMessage';

const meta: Meta<typeof EmptyStateMessage> = {
  title: 'Organisms/EmptyStateMessage',
  component: EmptyStateMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};