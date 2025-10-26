import type { Meta, StoryObj } from '@storybook/react-vite';

import Checkbox from 'src/components/atoms/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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

export const Unchecked: Story = {
  args: {
    checked: false,
    children: 'チェックボックスのラベル',
    name: 'checkbox',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    children: 'チェックボックスのラベル',
    name: 'checkbox',
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    children: '無効なチェックボックス',
    name: 'checkbox',
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    children: 'チェック済みで無効',
    name: 'checkbox',
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    checked: false,
    name: 'checkbox',
  },
};
