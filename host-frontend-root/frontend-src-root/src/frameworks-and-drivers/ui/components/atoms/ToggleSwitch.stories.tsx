import { useArgs } from 'storybook/preview-api';
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
  render: function Render(args) {
    const [{ checked }, updateArgs] = useArgs<typeof args>();

    return (
      <ToggleSwitch
        {...args}
        checked={checked ?? false}
        onChange={(newChecked) => updateArgs({ checked: newChecked })}
      />
    );
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    ariaLabel: 'ルールの有効化',
  },
  render: function Render(args) {
    const [{ checked }, updateArgs] = useArgs<typeof args>();

    return (
      <ToggleSwitch
        {...args}
        checked={checked ?? true}
        onChange={(newChecked) => updateArgs({ checked: newChecked })}
      />
    );
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
