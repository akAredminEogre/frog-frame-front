/**
 * ConfirmDialog コンポーネント - 確認ボタンラベルテスト
 * - カスタム確認ボタンラベルが表示される
 * - confirmLabel未指定の場合、デフォルト値「削除」が使用される
 */
import { ConfirmDialogTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - 確認ボタンラベル', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  const testCases = [
    {
      description: 'カスタム確認ボタンラベルが表示される',
      input: { confirmLabel: '実行する' },
      expected: '実行する',
    },
    {
      description: 'confirmLabel未指定の場合、デフォルト値「削除」が使用される',
      input: {},
      expected: '削除',
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render(testCase.input);

      // Assert
      const button = helper.getConfirmButton();
      expect(button?.textContent).toBe(testCase.expected);
    });
  });
});
