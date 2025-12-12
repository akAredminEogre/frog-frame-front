import type { Meta, StoryObj } from '@storybook/react-vite';

import ErrorMessage from 'src/components/molecules/ErrorMessage/ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Molecules/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'エラー時に表示するメッセージ',
    },
    onRetry: {
      action: 'retried',
      description: '再試行ボタンのクリックハンドラ',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithRetryButton: Story = {
  args: {
    onRetry: () => console.log('再試行がクリックされました'),
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'ネットワークエラーが発生しました',
  },
};

export const CustomMessageWithRetry: Story = {
  args: {
    message: 'サーバーとの接続が失われました',
    onRetry: () => console.log('再接続を試みます'),
  },
};

export const LongErrorMessage: Story = {
  args: {
    message: 'データベースへの接続中にタイムアウトが発生しました。ネットワーク接続を確認してください。',
    onRetry: () => console.log('再試行'),
  },
};

export const EnglishError: Story = {
  args: {
    message: 'Failed to load data',
    onRetry: () => console.log('Retry clicked'),
  },
};

export const ValidationError: Story = {
  args: {
    message: '入力されたデータに誤りがあります',
  },
};

export const PermissionError: Story = {
  args: {
    message: 'このリソースへのアクセス権限がありません',
  },
};