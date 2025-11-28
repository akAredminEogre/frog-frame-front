import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoadingMessage } from 'src/components/molecules/LoadingMessage';

const meta: Meta<typeof LoadingMessage> = {
  title: 'Molecules/LoadingMessage',
  component: LoadingMessage,
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

export const CustomMessage: Story = {
  args: {
    message: 'データを読み込んでいます...',
  },
};

export const LongMessage: Story = {
  args: {
    message: '大量のデータを処理しています。しばらくお待ちください...',
  },
};