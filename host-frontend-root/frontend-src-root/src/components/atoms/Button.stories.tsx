import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from 'src/components/atoms/Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
    },
    type: {
      control: 'radio',
      options: ['button', 'submit', 'reset'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: '保存',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'キャンセル',
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    children: '無効なボタン',
    variant: 'primary',
    disabled: true,
  },
};

export const SubmitButton: Story = {
  args: {
    children: '送信',
    variant: 'primary',
    type: 'submit',
  },
};

export const ResetButton: Story = {
  args: {
    children: 'リセット',
    variant: 'secondary',
    type: 'reset',
  },
};
