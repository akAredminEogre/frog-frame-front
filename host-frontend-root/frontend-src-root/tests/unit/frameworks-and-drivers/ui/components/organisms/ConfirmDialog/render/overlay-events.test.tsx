/**
 * ConfirmDialog コンポーネント - オーバーレイクリックテスト
 * 背景クリックの動作をテスト（ADR-007準拠）
 * - オーバーレイクリック: onCancelが呼ばれる
 * - ダイアログ内クリック: onCancelが呼ばれない
 */
import {
  ConfirmDialogTestHelper,
  flushPromises,
} from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ConfirmDialog - オーバーレイクリックイベント（ADR-007）', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('オーバーレイ（背景）クリック時にonCancelが呼ばれる', async () => {
    // Arrange
    const onCancel = vi.fn();
    await helper.render({ onCancel });

    // Act - オーバーレイを直接クリック
    const overlay = helper.getOverlayElement();
    expect(overlay).not.toBeNull();
    overlay?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('ダイアログ本体クリック時にonCancelは呼ばれない', async () => {
    // Arrange
    const onCancel = vi.fn();
    await helper.render({ onCancel });

    // Act - ダイアログ本体をクリック
    const dialog = helper.getDialogElement();
    expect(dialog).not.toBeNull();
    dialog?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();

    // Assert
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('タイトル要素クリック時にonCancelは呼ばれない', async () => {
    // Arrange
    const onCancel = vi.fn();
    await helper.render({ onCancel });

    // Act - タイトル要素をクリック
    const title = helper.getTitleElement();
    expect(title).not.toBeNull();
    title?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();

    // Assert
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('メッセージ要素クリック時にonCancelは呼ばれない', async () => {
    // Arrange
    const onCancel = vi.fn();
    await helper.render({ onCancel });

    // Act - メッセージ要素をクリック
    const message = helper.getMessageElement();
    expect(message).not.toBeNull();
    message?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();

    // Assert
    expect(onCancel).not.toHaveBeenCalled();
  });
});
