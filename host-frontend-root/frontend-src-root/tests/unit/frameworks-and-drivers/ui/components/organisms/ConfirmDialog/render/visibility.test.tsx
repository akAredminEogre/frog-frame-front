/**
 * ConfirmDialog コンポーネント - 表示/非表示テスト
 * isOpenプロパティに基づくダイアログの表示切り替えをテスト
 * - isOpen=false: ダイアログが表示されない
 * - isOpen=true: ダイアログが表示される
 */
import { ConfirmDialogTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - 表示/非表示', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  const testCases = [
    {
      description: 'isOpen=falseの場合、ダイアログが表示されない',
      input: { isOpen: false },
      expected: { dialogExists: false },
    },
    {
      description: 'isOpen=trueの場合、ダイアログが表示される',
      input: { isOpen: true },
      expected: { dialogExists: true },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render(testCase.input);

      // Assert
      const dialog = helper.getDialogElement();
      if (testCase.expected.dialogExists) {
        expect(dialog).not.toBeNull();
      } else {
        expect(dialog).toBeNull();
      }
    });
  });
});
