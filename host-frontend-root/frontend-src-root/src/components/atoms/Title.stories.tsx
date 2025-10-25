import type { Meta, StoryObj } from '@storybook/react-vite';

import Title from './Title';

const meta: Meta<typeof Title> = {
  title: 'Atoms/Title',
  component: Title,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Level1: Story = {
  args: {
    level: 1,
    children: 'レベル1のタイトル',
  },
};

export const Level2: Story = {
  args: {
    level: 2,
    children: 'レベル2のタイトル',
  },
};

export const Level3: Story = {
  args: {
    level: 3,
    children: 'レベル3のタイトル',
  },
};

export const Level4: Story = {
  args: {
    level: 4,
    children: 'レベル4のタイトル',
  },
};

export const Level5: Story = {
  args: {
    level: 5,
    children: 'レベル5のタイトル',
  },
};

export const Level6: Story = {
  args: {
    level: 6,
    children: 'レベル6のタイトル',
  },
};

export const LongTitle: Story = {
  args: {
    level: 2,
    children: 'これは長いタイトルのサンプルです。複数行にわたる可能性があります。',
  },
};
