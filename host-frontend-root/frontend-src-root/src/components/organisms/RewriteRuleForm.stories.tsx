import type { Meta, StoryObj } from '@storybook/react-vite';

import { RewriteRuleForm } from './RewriteRuleForm';

const meta: Meta<typeof RewriteRuleForm> = {
  title: 'Organisms/RewriteRuleForm',
  component: RewriteRuleForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRuleChange: { action: 'rule-changed' },
    onSave: { action: 'save-clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rule: {
      oldString: '',
      newString: '',
      urlPattern: '',
      isRegex: false,
    },
    isLoading: false,
  },
};

export const WithValues: Story = {
  args: {
    rule: {
      oldString: '置換前のテキスト',
      newString: '置換後のテキスト',
      urlPattern: 'https://example.com/*',
      isRegex: false,
    },
    isLoading: false,
  },
};

export const WithRegex: Story = {
  args: {
    rule: {
      oldString: '\\d{3}-\\d{4}',
      newString: '$1-****',
      urlPattern: 'https://example.com/*',
      isRegex: true,
    },
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    rule: {
      oldString: '置換前のテキスト',
      newString: '置換後のテキスト',
      urlPattern: 'https://example.com/*',
      isRegex: false,
    },
    isLoading: true,
  },
};

export const CustomTitle: Story = {
  args: {
    rule: {
      oldString: '',
      newString: '',
      urlPattern: '',
      isRegex: false,
    },
    isLoading: false,
    title: 'カスタムタイトル',
  },
};
