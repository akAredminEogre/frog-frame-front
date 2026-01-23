/**
 * ToastNotification コンポーネント - インタラクションテスト
 * 閉じるボタンクリック時のonCloseコールバック呼び出しを確認
 * - 閉じるボタンクリック: onCloseが呼ばれる
 */
import {
  flushPromises,
  ToastNotificationTestHelper,
} from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToastNotification/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ToastNotification - インタラクション', () => {
  const helper = new ToastNotificationTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('閉じるボタンをクリックするとonCloseが呼ばれる', async () => {
    // Arrange
    const mockOnClose = vi.fn();
    await helper.render({
      message: 'テストメッセージ',
      type: 'success',
      isVisible: true,
      onClose: mockOnClose,
    });

    // Act
    const closeButton = helper.getCloseButton();
    expect(closeButton).not.toBeNull();
    closeButton?.click();
    await flushPromises();

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
