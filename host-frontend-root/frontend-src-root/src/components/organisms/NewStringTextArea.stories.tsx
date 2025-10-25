import type { Meta, StoryObj } from '@storybook/react-vite';

import NewStringTextArea from './NewStringTextArea';

const meta: Meta<typeof NewStringTextArea> = {
  title: 'Organisms/NewStringTextArea',
  component: NewStringTextArea,
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
  },
};

export const WithValue: Story = {
  args: {
    value: '置換後のテキスト例',
  },
};

export const WithMultilineValue: Story = {
  args: {
    value: '1行目\n2行目\n3行目',
  },
};
