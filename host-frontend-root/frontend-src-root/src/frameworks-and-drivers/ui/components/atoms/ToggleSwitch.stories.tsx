import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Atoms/ToggleSwitch',
  component: ToggleSwitch,
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
    ariaLabel: 'ルールの有効化',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    ariaLabel: 'ルールの有効化',
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    ariaLabel: 'ルールの有効化',
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
    ariaLabel: 'ルールの有効化',
  },
};
