import type { Meta, StoryObj } from '@storybook/react-vite';

import RuleTableRow from 'src/components/molecules/RuleTableRow/RuleTableRow';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

const meta: Meta<typeof RuleTableRow> = {
  title: 'Molecules/RuleTableRow',
  component: RuleTableRow,
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
    isToggling: false,
    isDeleting: false,
  },
  decorators: [
    (Story) => (
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: '60px' }}>有効</th>
            <th style={{ width: '60px' }}>編集</th>
            <th style={{ width: '60px' }}>削除</th>
            <th style={{ width: '200px' }}>URLパターン</th>
            <th style={{ width: 'calc((100% - 380px) / 2)' }}>置換前</th>
            <th style={{ width: 'calc((100% - 380px) / 2)' }}>置換後</th>
          </tr>
        </thead>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rule: new RewriteRule(
      1,
      '旧文字列',
      '新文字列',
      'https://example.com',
      false,
      true
    ),
  },
};

export const WithRegex: Story = {
  args: {
    rule: new RewriteRule(
      2,
      '\\d{4}-\\d{2}-\\d{2}',
      '日付',
      'https://example.com/api',
      true,
      true
    ),
  },
};

export const LongUrl: Story = {
  args: {
    rule: new RewriteRule(
      3,
      'oldText',
      'newText',
      'https://example.com/very/long/url/pattern/that/exceeds/thirty/characters',
      false,
      true
    ),
  },
};

export const EmptyUrlPattern: Story = {
  args: {
    rule: new RewriteRule(
      4,
      'find',
      'replace',
      '',
      false,
      true
    ),
  },
};

export const JapaneseContent: Story = {
  args: {
    rule: new RewriteRule(
      5,
      'こんにちは',
      'おはよう',
      'https://ja.example.com',
      false,
      true
    ),
  },
};

export const LongStrings: Story = {
  args: {
    rule: new RewriteRule(
      6,
      'This is a very long old string that might be displayed in the table row',
      'This is a very long new string that might be displayed in the table row',
      'https://example.com/articles',
      false,
      true
    ),
  },
};

export const InactiveRule: Story = {
  args: {
    rule: new RewriteRule(
      7,
      'disabled',
      'rule',
      'https://example.com',
      false,
      false
    ),
  },
};

export const Deleting: Story = {
  args: {
    rule: new RewriteRule(
      8,
      'deleting',
      'rule',
      'https://example.com',
      false,
      true
    ),
    isDeleting: true,
  },
};

export const Toggling: Story = {
  args: {
    rule: new RewriteRule(
      9,
      'toggling',
      'rule',
      'https://example.com',
      false,
      true
    ),
    isToggling: true,
  },
};