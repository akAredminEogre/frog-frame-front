/**
 * ConfirmDialog コンポーネント - useIdによる動的ID連携テスト（ADR-007 1.1準拠）
 * - aria-labelledbyがタイトル要素のIDを参照している
 * - aria-describedbyがメッセージ要素のIDを参照している
 * - タイトル要素にuseIdで生成された一意のIDが設定されている
 * - メッセージ要素にuseIdで生成された一意のIDが設定されている
 */
import { ConfirmDialogTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - useIdによる動的ID連携（ADR-007 1.1準拠）', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('aria-labelledbyがタイトル要素のIDを参照している', async () => {
    // Arrange & Act
    await helper.render({ isOpen: true });

    // Assert
    const dialog = helper.getDialogElement();
    const title = helper.getTitleElement();
    expect(dialog).not.toBeNull();
    expect(title).not.toBeNull();

    const labelledbyId = dialog?.getAttribute('aria-labelledby');
    expect(labelledbyId).toBeTruthy();
    expect(title?.id).toBe(labelledbyId);
  });

  it('aria-describedbyがメッセージ要素のIDを参照している', async () => {
    // Arrange & Act
    await helper.render({ isOpen: true });

    // Assert
    const dialog = helper.getDialogElement();
    const message = helper.getMessageElement();
    expect(dialog).not.toBeNull();
    expect(message).not.toBeNull();

    const describedbyId = dialog?.getAttribute('aria-describedby');
    expect(describedbyId).toBeTruthy();
    expect(message?.id).toBe(describedbyId);
  });

  it('タイトル要素にuseIdで生成された一意のIDが設定されている', async () => {
    // Arrange & Act
    await helper.render({ isOpen: true });

    // Assert
    const title = helper.getTitleElement();
    expect(title).not.toBeNull();
    // useIdで動的に生成されるため、IDの形式は実装依存。プレフィックス部分のみ検証する
    expect(title?.id).toBeTruthy();
    expect(title?.id).toContain('confirm-dialog-title-');
  });

  it('メッセージ要素にuseIdで生成された一意のIDが設定されている', async () => {
    // Arrange & Act
    await helper.render({ isOpen: true });

    // Assert
    const message = helper.getMessageElement();
    expect(message).not.toBeNull();
    // useIdで動的に生成されるため、IDの形式は実装依存。プレフィックス部分のみ検証する
    expect(message?.id).toBeTruthy();
    expect(message?.id).toContain('confirm-dialog-description-');
  });
});
