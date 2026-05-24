/**
 * ToastNotification コンポーネント - 表示/非表示テスト
 * 配列形式でまとめた表示状態のテストケース
 * - isVisible=false: トーストが表示されない
 * - isVisible=true: トーストが表示される
 */
import { ToastNotificationTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToastNotification/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ToastNotification - 表示/非表示', () => {
  const helper = new ToastNotificationTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  type VisibilityTestCase = {
    description: string;
    input: { isVisible: boolean };
    expected: { rendered: boolean };
  };

  const testCases: Array<VisibilityTestCase> = [
    {
      description: 'isVisible=falseの場合、トーストが表示されない',
      input: { isVisible: false },
      expected: { rendered: false },
    },
    {
      description: 'isVisible=trueの場合、トーストが表示される',
      input: { isVisible: true },
      expected: { rendered: true },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({
        message: 'テストメッセージ',
        type: 'success',
        isVisible: testCase.input.isVisible,
        onClose: vi.fn(),
      });

      // Assert
      const alertElement = helper.getAlertElement();
      if (testCase.expected.rendered) {
        expect(alertElement).not.toBeNull();
      } else {
        expect(alertElement).toBeNull();
      }
    });
  });
});
