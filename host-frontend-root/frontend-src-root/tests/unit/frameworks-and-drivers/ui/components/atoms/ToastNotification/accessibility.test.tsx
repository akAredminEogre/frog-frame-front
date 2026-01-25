/**
 * ToastNotification コンポーネント - アクセシビリティテスト
 * WAI-ARIA属性の正しい設定を確認
 * - role="alert": role属性がalertに設定される
 * - aria-live="polite": aria-live属性がpoliteに設定される
 * - aria-label="閉じる": 閉じるボタンにaria-labelがある
 */
import { ToastNotificationTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToastNotification/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ToastNotification - アクセシビリティ', () => {
  const helper = new ToastNotificationTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  type AccessibilityTestCase = {
    description: string;
    expected: { attribute: string; value: string };
  };

  const alertAttributeTestCases: Array<AccessibilityTestCase> = [
    {
      description: 'role属性がalertに設定される',
      expected: { attribute: 'role', value: 'alert' },
    },
    {
      description: 'aria-live属性がpoliteに設定される',
      expected: { attribute: 'aria-live', value: 'polite' },
    },
  ];

  alertAttributeTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({
        message: 'テストメッセージ',
        type: 'success',
        isVisible: true,
        onClose: vi.fn(),
      });

      // Assert
      const alertElement = helper.getAlertElement();
      expect(alertElement).not.toBeNull();
      expect(alertElement?.getAttribute(testCase.expected.attribute)).toBe(
        testCase.expected.value,
      );
    });
  });

  it('閉じるボタンにaria-label="閉じる"が設定される', async () => {
    // Arrange & Act
    await helper.render({
      message: 'テストメッセージ',
      type: 'success',
      isVisible: true,
      onClose: vi.fn(),
    });

    // Assert
    const closeButton = helper.getCloseButton();
    expect(closeButton).not.toBeNull();
    expect(closeButton?.getAttribute('aria-label')).toBe('閉じる');
  });
});
