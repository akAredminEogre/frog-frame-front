/**
 * useDeleteRule - confirmDelete テスト
 *
 * - confirmDeleteでdeleteController.deleteRuleが呼ばれる
 * - confirmDelete中にdeletingIdsにruleIdが含まれる
 * - confirmDelete完了後にdeletingIdsからruleIdが除去される
 * - confirmDeleteでdeleteTargetIdがnullになる
 * - deleteTargetIdがnullの場合は何も実行されない
 * - deletingIds内のruleIdでconfirmDeleteが無視される
 * - deleteRuleが例外を投げてもdeletingIdsからruleIdが除去される
 */
import { act } from 'react';
import {
  createMockDeleteRuleControllerFactory,
  MockDeleteRuleControllerFactoryResult,
} from 'tests/unit/frameworks-and-drivers/ui/hooks/useDeleteRule/mocks/createMockDeleteRuleControllerFactory';
import {
  flushPromises,
  UseDeleteRuleTestHelper,
} from 'tests/unit/frameworks-and-drivers/ui/hooks/useDeleteRule/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { container } from 'src/frameworks-and-drivers/di/container';

vi.mock('src/frameworks-and-drivers/di/container', () => ({
  container: {
    resolve: vi.fn(),
  },
}));

describe('useDeleteRule - confirmDelete', () => {
  const helper = new UseDeleteRuleTestHelper();
  let mockResult: MockDeleteRuleControllerFactoryResult;

  beforeEach(() => {
    vi.clearAllMocks();
    helper.setup();
    mockResult = createMockDeleteRuleControllerFactory();
    vi.mocked(container.resolve).mockReturnValue(mockResult.factory);
  });

  afterEach(() => {
    helper.cleanup();
    vi.resetAllMocks();
  });

  it('confirmDeleteでdeleteController.deleteRuleが呼ばれる', async () => {
    // Arrange
    await helper.render();
    await helper.callHandleDelete(7);

    // Act
    await helper.callConfirmDelete();

    // Assert
    expect(mockResult.controller.deleteRule).toHaveBeenCalledWith(7);
    expect(mockResult.controller.deleteRule).toHaveBeenCalledTimes(1);
  });

  it('confirmDelete中にdeletingIdsにruleIdが含まれる', async () => {
    // Arrange
    let resolveDeleteRule!: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolveDeleteRule = resolve;
    });
    vi.mocked(mockResult.controller.deleteRule).mockReturnValue(deletePromise);

    await helper.render();
    await helper.callHandleDelete(3);

    // Act: confirmDeleteを開始（完了を待たない）
    await helper.startConfirmDeleteWithoutAwaiting();

    // Assert: deletingIdsにruleIdが含まれている
    expect(helper.getDeletingIds().has(3)).toBe(true);

    // クリーンアップ
    await act(async () => {
      resolveDeleteRule();
      await flushPromises();
    });
  });

  it('confirmDelete完了後にdeletingIdsからruleIdが除去される', async () => {
    // Arrange
    await helper.render();
    await helper.callHandleDelete(3);

    // Act
    await helper.callConfirmDelete();

    // Assert: deletingIdsからruleIdが削除されている
    expect(helper.getDeletingIds().has(3)).toBe(false);
  });

  it('confirmDeleteでdeleteTargetIdがnullになる', async () => {
    // Arrange
    await helper.render();
    await helper.callHandleDelete(5);
    expect(helper.getDeleteTargetId()).toBe(5);

    // Act
    await helper.callConfirmDelete();

    // Assert
    expect(helper.getDeleteTargetId()).toBeNull();
  });

  it('deleteTargetIdがnullの場合は何も実行されない', async () => {
    // Arrange
    await helper.render();
    // handleDeleteを呼ばずにconfirmDeleteを呼ぶ（deleteTargetId === null）

    // Act
    await helper.callConfirmDelete();

    // Assert
    expect(mockResult.controller.deleteRule).not.toHaveBeenCalled();
  });

  it('deletingIds内のruleIdでconfirmDeleteが無視される', async () => {
    // Arrange
    let resolveDeleteRule!: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolveDeleteRule = resolve;
    });
    vi.mocked(mockResult.controller.deleteRule).mockReturnValue(deletePromise);

    await helper.render();
    await helper.callHandleDelete(8);

    // 最初のconfirmDeleteを開始（完了させない）
    await helper.startConfirmDeleteWithoutAwaiting();
    expect(helper.getDeletingIds().has(8)).toBe(true);

    // ruleId=8を再度handleDeleteしようとするが、deletingIdsに含まれているため無視される
    await helper.callHandleDelete(8);

    // 2回目のconfirmDeleteを呼ぶ（deleteTargetIdはnullなので何も起きない）
    await helper.startConfirmDeleteWithoutAwaiting();

    // Assert: deleteRuleは1回しか呼ばれていない
    expect(mockResult.controller.deleteRule).toHaveBeenCalledTimes(1);

    // クリーンアップ
    await act(async () => {
      resolveDeleteRule();
      await flushPromises();
    });
  });

  it('deleteRuleが例外を投げてもdeletingIdsからruleIdが除去される', async () => {
    // Arrange
    vi.mocked(mockResult.controller.deleteRule).mockRejectedValue(
      new Error('削除失敗')
    );

    await helper.render();
    await helper.callHandleDelete(15);

    // Act: confirmDeleteは内部でrejectされるが、try/finallyでdeletingIdsは解除される
    // RulesAppでは void confirmDelete() で呼ばれるため、rejectは呼び出し側に伝播しない
    // テストではstartConfirmDeleteWithoutAwaitingを使い、同様にrejectを伝播させない
    await helper.startConfirmDeleteWithoutAwaiting();

    // Assert: deletingIdsからruleIdが除去されている（try/finallyで保証）
    expect(helper.getDeletingIds().has(15)).toBe(false);
    expect(helper.getDeletingIds().size).toBe(0);
  });
});
