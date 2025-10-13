import type { Meta, StoryObj } from '@storybook/react-vite';
import TextArea from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Atoms/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    rows: {
      control: { type: 'number', min: 1, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'テキストを入力してください',
    name: 'textarea',
    rows: 3,
  },
};

export const WithValue: Story = {
  args: {
    value: '既に入力されたテキストです。\n複数行のテキストを表示できます。',
    placeholder: 'テキストを入力してください',
    name: 'textarea',
    rows: 3,
  },
};

export const LargeRows: Story = {
  args: {
    value: '',
    placeholder: '大きなテキストエリア',
    name: 'textarea',
    rows: 8,
  },
};

export const Disabled: Story = {
  args: {
    value: '無効なテキストエリア',
    placeholder: 'テキストを入力してください',
    name: 'textarea',
    disabled: true,
    rows: 3,
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: '例: URLパターンに関する説明を入力してください',
    name: 'description',
    rows: 4,
  },
};
