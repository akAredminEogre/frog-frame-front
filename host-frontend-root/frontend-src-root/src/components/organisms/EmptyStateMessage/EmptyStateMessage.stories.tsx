import type { Meta, StoryObj } from '@storybook/react-vite';

import EmptyStateMessage from 'src/components/organisms/EmptyStateMessage/EmptyStateMessage';

const meta: Meta<typeof EmptyStateMessage> = {
  title: 'Organisms/EmptyStateMessage',
  component: EmptyStateMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const InDarkBackground: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const InLightBackground: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export const WithCustomViewport: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const InContainer: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ 
        width: '600px', 
        height: '400px', 
        border: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Story />
      </div>
    ),
  ],
};