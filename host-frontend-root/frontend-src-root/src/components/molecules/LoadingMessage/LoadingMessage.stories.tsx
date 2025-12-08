import type { Meta, StoryObj } from '@storybook/react-vite';

import LoadingMessage from 'src/components/molecules/LoadingMessage/LoadingMessage';

const meta: Meta<typeof LoadingMessage> = {
  title: 'Molecules/LoadingMessage',
  component: LoadingMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'ローディング時に表示するメッセージ',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomMessage: Story = {
  args: {
    message: '処理中です...',
  },
};

export const LongMessage: Story = {
  args: {
    message: 'データを取得しています。しばらくお待ちください...',
  },
};

export const EnglishMessage: Story = {
  args: {
    message: 'Loading...',
  },
};

export const ShortMessage: Story = {
  args: {
    message: '待機中',
  },
};