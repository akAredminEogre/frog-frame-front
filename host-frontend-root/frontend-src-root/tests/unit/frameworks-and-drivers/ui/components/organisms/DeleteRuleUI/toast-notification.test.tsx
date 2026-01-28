/**
 * DeleteRuleUI コンポーネント - ToastNotification表示テスト
 * deleteErrorプロパティに基づくエラーToast通知の表示切り替えをテスト
 * - deleteError=null: Toast通知が表示されない
 * - deleteError=オブジェクト: Toast通知が表示され、ruleIdとmessageを含むエラーメッセージが表示される
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

  type ToastVisibilityTestCase = {
    description: string;
    input: { deleteError: { ruleId: number; message: string } | null };
    expected: { toastExists: boolean };
  };

  const visibilityTestCases: Array<ToastVisibilityTestCase> = [
    {
      description: 'deleteError=nullの場合、Toast通知が表示されない',
      input: { deleteError: null },
      expected: { toastExists: false },
    },
    {
      description: 'deleteErrorが存在する場合、Toast通知が表示される',
      input: { deleteError: { ruleId: 1, message: '削除に失敗しました' } },
      expected: { toastExists: true },
    },
  ];

  visibilityTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({ deleteError: testCase.input.deleteError });

      // Assert
      const toast = helper.getToastNotification();
      if (testCase.expected.toastExists) {
        expect(toast).not.toBeNull();
      } else {
        expect(toast).toBeNull();
      }
    });
  });

  type ToastMessageTestCase = {
    description: string;
    input: { deleteError: { ruleId: number; message: string } };
    expected: { containsRuleId: boolean; containsMessage: boolean };
  };

  const messageTestCases: Array<ToastMessageTestCase> = [
    {
      description: 'エラーメッセージにruleIdが含まれる',
      input: { deleteError: { ruleId: 42, message: 'ネットワークエラー' } },
      expected: { containsRuleId: true, containsMessage: true },
    },
    {
      description: 'エラーメッセージにmessageが含まれる',
      input: { deleteError: { ruleId: 7, message: 'タイムアウト' } },
      expected: { containsRuleId: true, containsMessage: true },
    },
  ];

  messageTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({ deleteError: testCase.input.deleteError });

      // Assert
      const toast = helper.getToastNotification();
      expect(toast).not.toBeNull();
      const textContent = toast!.textContent ?? '';
      if (testCase.expected.containsRuleId) {
        expect(textContent).toContain(String(testCase.input.deleteError.ruleId));
      }
      if (testCase.expected.containsMessage) {
        expect(textContent).toContain(testCase.input.deleteError.message);
      }
    });
  });
});
