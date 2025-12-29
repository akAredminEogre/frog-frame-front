/**
 * ConfirmDialog コンポーネント - フォーカス管理テスト
 * フォーカスの自動移動をテスト（ADR-007準拠）
 * - 初期フォーカス: ダイアログ内の最初のボタンにフォーカス
 */
import {
  ConfirmDialogTestHelper,
  flushPromises,
} from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - フォーカス管理（ADR-007）', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('ダイアログが開いたとき、最初のフォーカス可能な要素（キャンセルボタン）にフォーカスが移動する', async () => {
    // Arrange & Act
    await helper.render({ isOpen: true });
    await flushPromises();

    // Assert
    const cancelButton = helper.getCancelButton();
    expect(cancelButton).not.toBeNull();
    expect(document.activeElement).toBe(cancelButton);
  });

  it('ダイアログが閉じているとき、フォーカスは移動しない', async () => {
    // Arrange
    const externalButton = document.createElement('button');
    externalButton.textContent = 'External';
    document.body.appendChild(externalButton);
    externalButton.focus();

    // Act
    await helper.render({ isOpen: false });
    await flushPromises();

    // Assert - フォーカスはそのまま
    expect(document.activeElement).toBe(externalButton);

    // Cleanup
    externalButton.remove();
  });
});
