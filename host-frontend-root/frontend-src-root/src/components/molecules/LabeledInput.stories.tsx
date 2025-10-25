import type { Meta, StoryObj } from '@storybook/react-vite';

import LabeledInput from './LabeledInput';

const meta: Meta<typeof LabeledInput> = {
  title: 'Molecules/LabeledInput',
  component: LabeledInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'ラベル',
    value: '',
    name: 'input',
    placeholder: 'プレースホルダーテキスト',
  },
};

export const WithValue: Story = {
  args: {
    label: 'URLパターン',
    value: 'https://example.com/*',
    name: 'urlPattern',
    placeholder: 'https://example.com/*',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'URLパターン',
    value: '',
    name: 'urlPattern',
    placeholder: 'https://example.com/*',
    description: 'URLのパターンを入力してください。ワイルドカード(*)が使用できます。',
  },
};

export const WithValueAndDescription: Story = {
  args: {
    label: 'URLパターン',
    value: 'https://qiita.com/*',
    name: 'urlPattern',
    placeholder: 'https://example.com/*',
    description: 'URLのパターンを入力してください。ワイルドカード(*)が使用できます。',
  },
};
