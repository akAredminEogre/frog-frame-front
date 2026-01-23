/**
 * ConfirmDialog コンポーネント - キャンセルボタンラベルテスト
 * - カスタムキャンセルボタンラベルが表示される
 * - cancelLabel未指定の場合、デフォルト値「キャンセル」が使用される
 */
import { ConfirmDialogTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - キャンセルボタンラベル', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  const testCases = [
    {
      description: 'カスタムキャンセルボタンラベルが表示される',
      input: { cancelLabel: '戻る' },
      expected: '戻る',
    },
    {
      description: 'cancelLabel未指定の場合、デフォルト値「キャンセル」が使用される',
      input: {},
      expected: 'キャンセル',
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render(testCase.input);

      // Assert
      const button = helper.getCancelButton();
      expect(button?.textContent).toBe(testCase.expected);
    });
  });
});
