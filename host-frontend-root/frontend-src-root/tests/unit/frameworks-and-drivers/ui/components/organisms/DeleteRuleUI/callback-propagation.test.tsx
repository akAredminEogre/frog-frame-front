/**
 * DeleteRuleUI コンポーネント - コールバック伝播テスト
 * 子コンポーネントのユーザーアクションに対するコールバック呼び出しをテスト
 * - 確認ボタンクリック: onConfirmDeleteが呼ばれる
 * - キャンセルボタンクリック: onCancelDeleteが呼ばれる
 * - Toast閉じるボタンクリック: onDismissErrorが呼ばれる
 */
import { act } from 'react';
import {
  DeleteRuleUITestHelper,
  flushPromises,
} from 'tests/unit/frameworks-and-drivers/ui/components/organisms/DeleteRuleUI/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('DeleteRuleUI - コールバック伝播', () => {
  const helper = new DeleteRuleUITestHelper();

  beforeEach(() => {
    vi.clearAllMocks();
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
    vi.resetAllMocks();
  });

  it('確認ボタンクリック時にonConfirmDeleteが呼ばれる', async () => {
    // Arrange
    const onConfirmDelete = vi.fn();
    await helper.render({
      deleteTargetId: 1,
      onConfirmDelete,
    });

    // Act
    const confirmButton = helper.getConfirmButton();
    expect(confirmButton).not.toBeNull();
    await act(async () => {
      confirmButton?.click();
      await flushPromises();
    });

    // Assert
    expect(onConfirmDelete).toHaveBeenCalledTimes(1);
  });

  it('キャンセルボタンクリック時にonCancelDeleteが呼ばれる', async () => {
    // Arrange
    const onCancelDelete = vi.fn();
    await helper.render({
      deleteTargetId: 1,
      onCancelDelete,
    });

    // Act
    const cancelButton = helper.getCancelButton();
    expect(cancelButton).not.toBeNull();
    await act(async () => {
      cancelButton?.click();
      await flushPromises();
    });

    // Assert
    expect(onCancelDelete).toHaveBeenCalledTimes(1);
  });

  it('Toast閉じるボタンクリック時にonDismissErrorが呼ばれる', async () => {
    // Arrange
    const onDismissError = vi.fn();
    await helper.render({
      deleteError: 'ルール 1 の削除処理中にエラーが発生しました: テストエラー',
      onDismissError,
    });

    // Act
    const closeButton = helper.getToastCloseButton();
    expect(closeButton).not.toBeNull();
    await act(async () => {
      closeButton?.click();
      await flushPromises();
    });

    // Assert
    expect(onDismissError).toHaveBeenCalledTimes(1);
  });
});
