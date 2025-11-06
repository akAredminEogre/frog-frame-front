import type { Meta, StoryObj } from '@storybook/react-vite';

import LabeledTextArea from 'src/components/molecules/LabeledTextArea';

const meta: Meta<typeof LabeledTextArea> = {
  title: 'Molecules/LabeledTextArea',
  component: LabeledTextArea,
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
    name: 'textarea',
    placeholder: 'プレースホルダーテキスト',
    rows: 5,
  },
};

export const WithValue: Story = {
  args: {
    label: '置換前の文字列',
    value: 'これは\n複数行の\nテキストです',
    name: 'oldString',
    placeholder: '置換前の文字列を入力',
    rows: 5,
  },
};

export const WithDescription: Story = {
  args: {
    label: '置換前の文字列',
    value: '',
    name: 'oldString',
    placeholder: '置換前の文字列を入力',
    description: '置換したい文字列を入力してください。正規表現も使用できます。',
    rows: 5,
  },
};

export const WithValueAndDescription: Story = {
  args: {
    label: '置換後の文字列',
    value: 'これは置換後のテキストです',
    name: 'newString',
    placeholder: '置換後の文字列を入力',
    description: '置換後の文字列を入力してください。',
    rows: 5,
  },
};

export const LargeRows: Story = {
  args: {
    label: 'コメント',
    value: '',
    name: 'comment',
    placeholder: 'コメントを入力してください',
    rows: 10,
  },
};
