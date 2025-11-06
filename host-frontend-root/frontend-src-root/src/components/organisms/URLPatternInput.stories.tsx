import type { Meta, StoryObj } from '@storybook/react-vite';

import URLPatternInput from 'src/components/organisms/URLPatternInput';

const meta: Meta<typeof URLPatternInput> = {
  title: 'Organisms/URLPatternInput',
  component: URLPatternInput,
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
    value: 'https://qiita.com/',
  },
};

export const WithWildcard: Story = {
  args: {
    value: 'https://example.com/*',
  },
};

export const WithSpecificPath: Story = {
  args: {
    value: 'https://github.com/user/repo',
  },
};
