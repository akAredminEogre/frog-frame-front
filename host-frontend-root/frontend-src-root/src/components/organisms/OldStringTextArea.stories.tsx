import type { Meta, StoryObj } from '@storybook/react-vite';

import OldStringTextArea from './OldStringTextArea';

const meta: Meta<typeof OldStringTextArea> = {
  title: 'Organisms/OldStringTextArea',
  component: OldStringTextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    onRegexChange: { action: 'regex-changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    isRegex: false,
  },
};

export const WithValue: Story = {
  args: {
    value: '置換前のテキスト例',
    isRegex: false,
  },
};

export const WithRegexEnabled: Story = {
  args: {
    value: '\\d{3}-\\d{4}',
    isRegex: true,
  },
};

export const WithMultilineValue: Story = {
  args: {
    value: '1行目\n2行目\n3行目',
    isRegex: false,
  },
};
