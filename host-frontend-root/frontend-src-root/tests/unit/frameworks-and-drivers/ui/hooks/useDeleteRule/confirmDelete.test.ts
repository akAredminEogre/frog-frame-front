/**
 * useDeleteRule - confirmDelete テスト
 *
 * confirmDeleteメソッドの動作を検証する:
 * 1. deleteController.deleteRuleが正しいruleIdで呼ばれる
 * 2. 呼び出し中はdeletingIdsにruleIdが追加される
 * 3. 完了後にdeletingIdsからruleIdが削除される
 * 4. deleteTargetIdがnullの場合は何もしない
 * 5. deleteTargetIdがdeletingIdsに含まれる場合は何もしない
 * 6. deleteTargetIdがnullにリセットされる
 * 7. deleteRuleが例外を投げてもdeletingIdsからruleIdが除去される
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
    helper.setup();
    mockResult = createMockDeleteRuleControllerFactory();
    (container.resolve as ReturnType<typeof vi.fn>).mockReturnValue(mockResult.factory);
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('deleteController.deleteRuleが正しいruleIdで呼ばれる', async () => {
    // Arrange
    await helper.render();
    await helper.callHandleDelete(7);

    // Act
    await helper.callConfirmDelete();

    // Assert
    expect(mockResult.controller.deleteRule).toHaveBeenCalledWith(7);
    expect(mockResult.controller.deleteRule).toHaveBeenCalledTimes(1);
  });

  it('呼び出し中はdeletingIdsにruleIdが追加され、完了後に削除される', async () => {
    // Arrange
    let resolveDeleteRule!: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolveDeleteRule = resolve;
    });
    (mockResult.controller.deleteRule as ReturnType<typeof vi.fn>).mockReturnValue(deletePromise);

    await helper.render();
    await helper.callHandleDelete(3);

    // Act: confirmDeleteを開始（完了を待たない）
    await helper.startConfirmDeleteWithoutAwaiting();

    // Assert: deletingIdsにruleIdが含まれている
    expect(helper.getDeletingIds().has(3)).toBe(true);

    // Act: deleteRuleのPromiseを解決
    await act(async () => {
      resolveDeleteRule();
      await flushPromises();
    });

    // Assert: deletingIdsからruleIdが削除されている
    expect(helper.getDeletingIds().has(3)).toBe(false);
  });

  it('deleteTargetIdがnullの場合はdeleteRuleが呼ばれない', async () => {
    // Arrange
    await helper.render();
    // handleDeleteを呼ばずにconfirmDeleteを呼ぶ（deleteTargetId === null）

    // Act
    await helper.callConfirmDelete();

    // Assert
    expect(mockResult.controller.deleteRule).not.toHaveBeenCalled();
  });

  it('confirmDelete後にdeleteTargetIdがnullにリセットされる', async () => {
    // Arrange
    await helper.render();
    await helper.callHandleDelete(5);
    expect(helper.getDeleteTargetId()).toBe(5);

    // Act
    await helper.callConfirmDelete();

    // Assert
    expect(helper.getDeleteTargetId()).toBeNull();
  });

  describe('異なるruleIdでの呼び出し', () => {
    const testCases = [
      {
        description: 'ruleId=1でdeleteRuleが呼ばれる',
        ruleId: 1,
      },
      {
        description: 'ruleId=100でdeleteRuleが呼ばれる',
        ruleId: 100,
      },
    ];

    testCases.forEach((testCase) => {
      it(testCase.description, async () => {
        // Arrange
        await helper.render();
        await helper.callHandleDelete(testCase.ruleId);

        // Act
        await helper.callConfirmDelete();

        // Assert
        expect(mockResult.controller.deleteRule).toHaveBeenCalledWith(testCase.ruleId);
      });
    });
  });

  it('同じruleIdが既にdeletingIdsに含まれる場合はdeleteRuleが呼ばれない', async () => {
    // Arrange
    let resolveDeleteRule!: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolveDeleteRule = resolve;
    });
    (mockResult.controller.deleteRule as ReturnType<typeof vi.fn>).mockReturnValue(deletePromise);

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
    (mockResult.controller.deleteRule as ReturnType<typeof vi.fn>).mockRejectedValue(
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
