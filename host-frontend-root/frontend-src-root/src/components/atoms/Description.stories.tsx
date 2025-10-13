import type { Meta, StoryObj } from '@storybook/react-vite';
import Description from './Description';

const meta: Meta<typeof Description> = {
  title: 'Atoms/Description',
  component: Description,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium'],
    },
    variant: {
      control: 'radio',
      options: ['default', 'muted'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallMuted: Story = {
  args: {
    children: 'これは小さいミュートされた説明文です。',
    size: 'small',
    variant: 'muted',
  },
};

export const SmallDefault: Story = {
  args: {
    children: 'これは小さいデフォルトの説明文です。',
    size: 'small',
    variant: 'default',
  },
};

export const MediumMuted: Story = {
  args: {
    children: 'これは中サイズのミュートされた説明文です。',
    size: 'medium',
    variant: 'muted',
  },
};

export const MediumDefault: Story = {
  args: {
    children: 'これは中サイズのデフォルトの説明文です。',
    size: 'medium',
    variant: 'default',
  },
};

export const LongText: Story = {
  args: {
    children: 'これは長い説明文のサンプルです。複数行にわたる説明文がどのように表示されるかを確認するために使用します。このテキストは十分に長く、複数の行にまたがる可能性があります。',
    size: 'small',
    variant: 'muted',
  },
};
