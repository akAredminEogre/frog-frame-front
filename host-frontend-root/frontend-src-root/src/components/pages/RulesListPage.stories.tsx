import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { RulesListPage } from 'src/components/pages/RulesListPage';

const meta: Meta<typeof RulesListPage> = {
  title: 'Pages/RulesListPage',
  component: RulesListPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif', margin: 0, padding: '20px', backgroundColor: '#f8f9fa', color: '#333', lineHeight: 1.6 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ルールの読み込み中状態を表示します。',
      },
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ルールが保存されていない空の状態を表示します。',
      },
    },
  },
};

export const WithRules: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ルールが保存されている状態を表示します。テーブル形式でルール一覧が表示されます。',
      },
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ルールの読み込みでエラーが発生した状態を表示します。',
      },
    },
  },
};