/**
 * ConfirmDialog コンポーネント - ボタンクリックイベントテスト
 * ユーザーアクションに対するコールバック呼び出しをテスト
 * - 確認ボタンクリック: onConfirmが呼ばれる
 * - キャンセルボタンクリック: onCancelが呼ばれる
 */
import {
  ConfirmDialogTestHelper,
  flushPromises,
} from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ConfirmDialog - ボタンクリックイベント', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('確認ボタンクリック時にonConfirmが呼ばれる', async () => {
    // Arrange
    const onConfirm = vi.fn();
    await helper.render({ onConfirm });

    // Act
    const confirmButton = helper.getConfirmButton();
    expect(confirmButton).not.toBeNull();
    confirmButton?.click();
    await flushPromises();

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('キャンセルボタンクリック時にonCancelが呼ばれる', async () => {
    // Arrange
    const onCancel = vi.fn();
    await helper.render({ onCancel });

    // Act
    const cancelButton = helper.getCancelButton();
    expect(cancelButton).not.toBeNull();
    cancelButton?.click();
    await flushPromises();

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('確認ボタンクリック時にonCancelは呼ばれない', async () => {
    // Arrange
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    await helper.render({ onConfirm, onCancel });

    // Act
    const confirmButton = helper.getConfirmButton();
    confirmButton?.click();
    await flushPromises();

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('キャンセルボタンクリック時にonConfirmは呼ばれない', async () => {
    // Arrange
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    await helper.render({ onConfirm, onCancel });

    // Act
    const cancelButton = helper.getCancelButton();
    cancelButton?.click();
    await flushPromises();

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
