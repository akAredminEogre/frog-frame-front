/**
 * DeleteRuleUI コンポーネント - ConfirmDialog表示テスト
 * deleteTargetIdプロパティに基づく確認ダイアログの表示切り替えをテスト
 * - deleteTargetId=null: ダイアログが表示されない
 * - deleteTargetId=数値: ダイアログが表示される
 */
import { DeleteRuleUITestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/DeleteRuleUI/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('DeleteRuleUI - ConfirmDialog表示', () => {
  const helper = new DeleteRuleUITestHelper();

  beforeEach(() => {
    vi.clearAllMocks();
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
    vi.resetAllMocks();
  });

  type ConfirmDialogVisibilityTestCase = {
    description: string;
    input: { deleteTargetId: number | null };
    expected: { dialogExists: boolean };
  };

  const testCases: Array<ConfirmDialogVisibilityTestCase> = [
    {
      description: 'deleteTargetId=nullの場合、確認ダイアログが表示されない',
      input: { deleteTargetId: null },
      expected: { dialogExists: false },
    },
    {
      description: 'deleteTargetId=1の場合、確認ダイアログが表示される',
      input: { deleteTargetId: 1 },
      expected: { dialogExists: true },
    },
    {
      description: 'deleteTargetId=999の場合、確認ダイアログが表示される',
      input: { deleteTargetId: 999 },
      expected: { dialogExists: true },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({ deleteTargetId: testCase.input.deleteTargetId });

      // Assert
      const dialog = helper.getConfirmDialog();
      expect(dialog !== null).toBe(testCase.expected.dialogExists);
    });
  });
});
