import type { Meta, StoryObj } from '@storybook/react-vite';

import { RuleTableRow } from 'src/components/molecules/RuleTableRow';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

const meta: Meta<typeof RuleTableRow> = {
  title: 'Molecules/RuleTableRow',
  component: RuleTableRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edit-rule' },
  },
  decorators: [
    (Story) => (
      <table>
        <thead>
          <tr>
            <th>URLパターン</th>
            <th>置換前</th>
            <th>置換後</th>
            <th>正規表現</th>
            <th>操作</th>
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

// サンプルデータの作成
const normalRule = new RewriteRule(1, 'twitter.com', 'x.com', 'https://twitter.com/*', false, true);
const regexRule = new RewriteRule(2, '\\d{3}-\\d{4}', 'XXX-XXXX', 'https://example.com/*', true, true);
const longUrlRule = new RewriteRule(3, '古いドメイン', '新しいドメイン', 'https://very-long-domain-name-that-should-be-truncated.example.com/path/to/resource', false, true);
const emptyUrlRule = new RewriteRule(4, 'テスト', '置換後', '', false, true);

export const Default: Story = {
  args: {
    rule: normalRule,
    onEdit: (ruleId: string | number) => {
      console.log('Edit rule:', ruleId);
    },
  },
};

export const RegexRule: Story = {
  args: {
    rule: regexRule,
    onEdit: (ruleId: string | number) => {
      console.log('Edit rule:', ruleId);
    },
  },
};

export const LongUrlPattern: Story = {
  args: {
    rule: longUrlRule,
    onEdit: (ruleId: string | number) => {
      console.log('Edit rule:', ruleId);
    },
  },
};

export const EmptyUrlPattern: Story = {
  args: {
    rule: emptyUrlRule,
    onEdit: (ruleId: string | number) => {
      console.log('Edit rule:', ruleId);
    },
  },
};