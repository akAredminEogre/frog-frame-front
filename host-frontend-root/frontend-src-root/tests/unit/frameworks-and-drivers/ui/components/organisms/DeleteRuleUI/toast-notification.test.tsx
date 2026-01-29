/**
 * DeleteRuleUI コンポーネント - ToastNotification表示テスト
 * - deleteError=nullの場合、Toast通知が表示されない
 * - deleteErrorが存在する場合、Toast通知が表示され、ruleIdとmessageを含む
 */
import { DeleteRuleUITestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/DeleteRuleUI/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('DeleteRuleUI - ToastNotification表示', () => {
  const helper = new DeleteRuleUITestHelper();

  beforeEach(() => {
    vi.clearAllMocks();
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
    vi.resetAllMocks();
  });

  type TestCase = {
    description: string;
    input: { deleteError: { ruleId: number; message: string } | null };
    expected: {
      toastExists: boolean;
      containsRuleId: boolean;
      containsMessage: boolean;
    };
  };

  const testCases: Array<TestCase> = [
    {
      description: 'deleteError=nullの場合、Toast通知が表示されない',
      input: { deleteError: null },
      expected: { toastExists: false, containsRuleId: false, containsMessage: false },
    },
    {
      description: 'deleteErrorが存在する場合、Toast通知が表示され、ruleIdとmessageを含む',
      input: { deleteError: { ruleId: 42, message: 'ネットワークエラー' } },
      expected: { toastExists: true, containsRuleId: true, containsMessage: true },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({ deleteError: testCase.input.deleteError });

      // Assert
      const toast = helper.getToastNotification();
      expect(toast !== null).toBe(testCase.expected.toastExists);

      if (toast) {
        const textContent = toast.textContent ?? '';
        expect(textContent.includes(String(testCase.input.deleteError!.ruleId))).toBe(
          testCase.expected.containsRuleId
        );
        expect(textContent.includes(testCase.input.deleteError!.message)).toBe(
          testCase.expected.containsMessage
        );
      }
    });
  });
});
