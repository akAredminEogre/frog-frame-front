/**
 * ToastNotification コンポーネント - Props反映テスト
 * 配列形式でまとめたPropsのテストケース
 * - message: メッセージテキストが表示される
 * - type="success": data-type="success"が設定される
 * - type="error": data-type="error"が設定される
 */
import { ToastNotificationTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToastNotification/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ToastNotification - Props反映', () => {
  const helper = new ToastNotificationTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('messageプロパティのテキストが表示される', async () => {
    // Arrange
    const expectedMessage = 'ルールを削除しました';

    // Act
    await helper.render({
      message: expectedMessage,
      type: 'success',
      isVisible: true,
      onClose: vi.fn(),
    });

    // Assert
    const messageText = helper.getMessageText();
    expect(messageText).toBe(expectedMessage);
  });

  type TypeTestCase = {
    description: string;
    input: { type: 'success' | 'error' };
    expected: { dataType: string };
  };

  const typeTestCases: Array<TypeTestCase> = [
    {
      description: 'type="success"の場合、data-type="success"が設定される',
      input: { type: 'success' },
      expected: { dataType: 'success' },
    },
    {
      description: 'type="error"の場合、data-type="error"が設定される',
      input: { type: 'error' },
      expected: { dataType: 'error' },
    },
  ];

  typeTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({
        message: 'テストメッセージ',
        type: testCase.input.type,
        isVisible: true,
        onClose: vi.fn(),
      });

      // Assert
      const alertElement = helper.getAlertElement();
      expect(alertElement).not.toBeNull();
      expect(alertElement?.getAttribute('data-type')).toBe(
        testCase.expected.dataType,
      );
    });
  });
});
