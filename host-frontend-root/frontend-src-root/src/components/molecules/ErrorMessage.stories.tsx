import type { Meta, StoryObj } from '@storybook/react-vite';

import { ErrorMessage } from 'src/components/molecules/ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Molecules/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: 'エラーが発生しました。',
  },
};

export const NetworkError: Story = {
  args: {
    error: 'ネットワークエラーが発生しました。接続を確認してください。',
  },
};

export const ValidationError: Story = {
  args: {
    error: '入力内容に誤りがあります。正しい値を入力してください。',
  },
};

export const LongError: Story = {
  args: {
    error: '予期しないエラーが発生しました。この問題が継続する場合は、ページを再読み込みするか、しばらく時間をおいてから再度お試しください。',
  },
};