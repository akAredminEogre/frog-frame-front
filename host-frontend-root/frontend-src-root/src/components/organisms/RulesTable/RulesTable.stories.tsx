import type { Meta, StoryObj } from '@storybook/react-vite';

import RulesTable from 'src/components/organisms/RulesTable/RulesTable';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

const meta: Meta<typeof RulesTable> = {
  title: 'Organisms/RulesTable',
  component: RulesTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edited' },
    onToggle: { action: 'toggled' },
    onDelete: { action: 'deleted' },
  },
  args: {
    togglingIds: new Set<number>(),
    deletingIds: new Set<number>(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRules: RewriteRule[] = [
  new RewriteRule(createRuleId(1), '旧文字列', '新文字列', 'https://example.com', false, true),
  new RewriteRule(createRuleId(2), 'oldText', 'newText', 'https://api.example.com', false, true),
  new RewriteRule(createRuleId(3), '\\d{4}-\\d{2}-\\d{2}', '日付', 'https://example.com/date', true, true),
];

export const Default: Story = {
  args: {
    rules: sampleRules,
  },
};

export const SingleRule: Story = {
  args: {
    rules: [
      new RewriteRule(createRuleId(1), 'find', 'replace', 'https://example.com', false, true),
    ],
  },
};

export const ManyRules: Story = {
  args: {
    rules: Array.from({ length: 10 }, (_, i) =>
      new RewriteRule(
        createRuleId(i + 1),
        `oldString${i + 1}`,
        `newString${i + 1}`,
        `https://example${i + 1}.com`,
        i % 3 === 0,
        true
      )
    ),
  },
};

export const MixedContent: Story = {
  args: {
    rules: [
      new RewriteRule(createRuleId(1), 'こんにちは', 'おはよう', 'https://ja.example.com', false, true),
      new RewriteRule(createRuleId(2), 'Hello', 'Hi', 'https://en.example.com', false, true),
      new RewriteRule(createRuleId(3), '[0-9]+', 'NUMBER', 'https://regex.example.com', true, true),
      new RewriteRule(createRuleId(4), '<div>', '<section>', 'https://html.example.com', false, true),
      new RewriteRule(createRuleId(5), 'long_variable_name_that_might_overflow', 'short', 'https://code.example.com', false, true),
    ],
  },
};

export const WithLongUrls: Story = {
  args: {
    rules: [
      new RewriteRule(
        createRuleId(1),
        'text1',
        'replacement1',
        'https://example.com/very/long/url/pattern/that/exceeds/thirty/characters/limit',
        false,
        true
      ),
      new RewriteRule(
        createRuleId(2),
        'text2',
        'replacement2',
        'https://another-example.com/api/v2/resources/items',
        false,
        true
      ),
      new RewriteRule(
        createRuleId(3),
        'text3',
        'replacement3',
        'https://short.com',
        false,
        true
      ),
    ],
  },
};

export const AllRegexRules: Story = {
  args: {
    rules: [
      new RewriteRule(createRuleId(1), '^https?://', 'protocol://', 'https://example.com', true, true),
      new RewriteRule(createRuleId(2), '\\w+@\\w+\\.\\w+', 'email', 'https://mail.example.com', true, true),
      new RewriteRule(createRuleId(3), '\\d{3}-\\d{4}-\\d{4}', '電話番号', 'https://tel.example.com', true, true),
    ],
  },
};

export const EmptyTable: Story = {
  args: {
    rules: [],
  },
};

export const InactiveRules: Story = {
  args: {
    rules: [
      new RewriteRule(createRuleId(1), 'active1', 'replacement1', 'https://example.com', false, true),
      new RewriteRule(createRuleId(2), 'inactive', 'replacement2', 'https://example.com', false, false),
      new RewriteRule(createRuleId(3), 'active2', 'replacement3', 'https://example.com', false, true),
    ],
  },
};

export const WithDeletingRule: Story = {
  args: {
    rules: sampleRules,
    deletingIds: new Set<number>([2]),
  },
};

export const WithTogglingRule: Story = {
  args: {
    rules: sampleRules,
    togglingIds: new Set<number>([1]),
  },
};