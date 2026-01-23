/**
 * ConfirmDialog コンポーネント - キーボードイベントテスト
 * キーボードアクセシビリティをテスト（ADR-007準拠）
 * - Escapeキー: onCancelが呼ばれる
 *
 * 注意: Tab/Shift+Tabによるフォーカストラップは React Aria の FocusScope が管理する。
 * happy-dom テスト環境では合成キーボードイベントでフォーカス移動をシミュレートできないため、
 * ユニットテストでは FocusScope の設定（contain属性）を検証し、
 * 実際のフォーカストラップ動作は E2E テストで検証する。
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

  // 注意: Tab/Shift+Tab によるフォーカストラップテストは削除
  // React Aria の FocusScope が管理するため、happy-dom では合成イベントで正しくテストできない
  // 実際のフォーカストラップ動作は E2E テストで検証する

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
