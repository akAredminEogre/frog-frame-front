import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
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
    value: '',
    placeholder: 'プレースホルダーテキスト',
    name: 'input',
  },
};

export const WithValue: Story = {
  args: {
    value: '入力されたテキスト',
    placeholder: 'プレースホルダーテキスト',
    name: 'input',
  },
};

export const Disabled: Story = {
  args: {
    value: '無効な入力フィールド',
    placeholder: 'プレースホルダーテキスト',
    name: 'input',
    disabled: true,
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: '例: https://qiita.com/',
    name: 'urlPattern',
  },
};
