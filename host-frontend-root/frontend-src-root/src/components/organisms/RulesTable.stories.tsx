import type { Meta, StoryObj } from '@storybook/react-vite';

import { RulesTable } from 'src/components/organisms/RulesTable';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

const meta: Meta<typeof RulesTable> = {
  title: 'Organisms/RulesTable',
  component: RulesTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onEditRule: { action: 'edit-rule' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータの作成
const sampleRules = [
  new RewriteRule(1, 'twitter.com', 'x.com', 'https://twitter.com/*', false, true),
  new RewriteRule(2, '古いドメイン', '新しいドメイン', 'https://old-domain.com/*', false, true),
  new RewriteRule(3, '\\d{3}-\\d{4}', 'XXX-XXXX', 'https://example.com/*', true, false),
];

export const Default: Story = {
  args: {
    rules: sampleRules,
    onEditRule: (ruleId: string | number) => {
      console.log('Edit rule:', ruleId);
    },
  },
};

export const SingleRule: Story = {
  args: {
    rules: [sampleRules[0]],
    onEditRule: (ruleId: string | number) => {
      console.log('Edit rule:', ruleId);
    },
  },
};

export const EmptyRules: Story = {
  args: {
    rules: [],
    onEditRule: (ruleId: string | number) => {
      console.log('Edit rule:', ruleId);
    },
  },
};

export const ManyRules: Story = {
  args: {
    rules: [
      ...sampleRules,
      new RewriteRule(4, 'Sample 1', 'Replaced 1', 'https://sample1.com/*', false, true),
      new RewriteRule(5, 'Sample 2', 'Replaced 2', 'https://sample2.com/*', false, true),
      new RewriteRule(6, '[0-9]+', 'NUMBER', 'https://regex-test.com/*', true, true),
    ],
    onEditRule: (ruleId: string | number) => {
      console.log('Edit rule:', ruleId);
    },
  },
};