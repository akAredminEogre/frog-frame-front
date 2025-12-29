/**
 * ConfirmDialog コンポーネント - キーボードイベントテスト
 * キーボードアクセシビリティをテスト（ADR-007準拠）
 * - Escapeキー: onCancelが呼ばれる
 * - Tabキー: フォーカスがダイアログ内でループする
 * - Shift+Tabキー: 逆方向にフォーカスがループする
 */
import {
  ConfirmDialogTestHelper,
  flushPromises,
} from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ConfirmDialog - キーボードイベント（ADR-007）', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('Escapeキー押下時にonCancelが呼ばれる', async () => {
    // Arrange
    const onCancel = vi.fn();
    await helper.render({ onCancel });

    // Act
    const dialog = helper.getDialogElement();
    expect(dialog).not.toBeNull();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    dialog?.dispatchEvent(event);
    await flushPromises();

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('Tabキーで最後の要素から最初の要素にフォーカスがループする', async () => {
    // Arrange
    await helper.render();
    const cancelButton = helper.getCancelButton();
    const confirmButton = helper.getConfirmButton();
    expect(confirmButton).not.toBeNull();
    expect(cancelButton).not.toBeNull();

    // 確認ボタン（最後の要素）にフォーカスを設定
    confirmButton?.focus();
    expect(document.activeElement).toBe(confirmButton);

    // Act
    const dialog = helper.getDialogElement();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    dialog?.dispatchEvent(event);
    await flushPromises();

    // Assert - フォーカスがキャンセルボタン（最初の要素）に移動
    expect(document.activeElement).toBe(cancelButton);
  });

  it('Shift+Tabキーで最初の要素から最後の要素にフォーカスがループする', async () => {
    // Arrange
    await helper.render();
    const cancelButton = helper.getCancelButton();
    const confirmButton = helper.getConfirmButton();
    expect(confirmButton).not.toBeNull();
    expect(cancelButton).not.toBeNull();

    // キャンセルボタン（最初の要素）にフォーカスを設定
    cancelButton?.focus();
    expect(document.activeElement).toBe(cancelButton);

    // Act
    const dialog = helper.getDialogElement();
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
    dialog?.dispatchEvent(event);
    await flushPromises();

    // Assert - フォーカスが確認ボタン（最後の要素）に移動
    expect(document.activeElement).toBe(confirmButton);
  });

  it('他のキー押下時にonCancelは呼ばれない', async () => {
    // Arrange
    const onCancel = vi.fn();
    await helper.render({ onCancel });

    // Act
    const dialog = helper.getDialogElement();
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    dialog?.dispatchEvent(event);
    await flushPromises();

    // Assert
    expect(onCancel).not.toHaveBeenCalled();
  });
});
