/**
 * useDeleteRule - handleDelete テスト
 *
 * - ruleIdを渡すとdeleteTargetIdがそのIDに設定される
 * - 既存のdeleteErrorがクリアされる
 * - deletingIdsに含まれるruleIdの場合は無視される
 * - 異なるruleIdで連続して呼び出すとdeleteTargetIdが上書きされる
 */
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

describe('useDeleteRule - handleDelete', () => {
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

  it('ruleIdを渡すとdeleteTargetIdがそのIDに設定される', async () => {
    await helper.render();

    await helper.callHandleDelete(42);

    expect(helper.getDeleteTargetId()).toBe(42);
  });

  it('既存のdeleteErrorがクリアされる', async () => {
    // Arrange
    await helper.render();

    // deleteErrorを設定するためにonErrorコールバックを呼び出す
    const onError = mockResult.getCapturedOnError();
    expect(onError).not.toBeNull();

    // act内でonErrorを呼び出してdeleteErrorを設定
    const { act } = await import('react');
    await act(async () => {
      onError!(5, 'テストエラー');
      await flushPromises();
    });
    expect(helper.getDeleteError()).toEqual({ ruleId: 5, message: 'テストエラー' });

    // Act
    await helper.callHandleDelete(10);

    // Assert
    expect(helper.getDeleteError()).toBeNull();
    expect(helper.getDeleteTargetId()).toBe(10);
  });

  it('deletingIdsに含まれるruleIdの場合は無視される', async () => {
    // Arrange
    await helper.render();

    // confirmDeleteでdeletingIdsにIDを追加する（deleteRuleを未解決のままにする）
    let resolveDeleteRule!: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolveDeleteRule = resolve;
    });
    vi.mocked(mockResult.controller.deleteRule).mockReturnValue(deletePromise);

    // handleDelete → startConfirmDeleteWithoutAwaitingでruleId=1をdeletingIdsに追加
    await helper.callHandleDelete(1);
    await helper.startConfirmDeleteWithoutAwaiting();

    // この時点でruleId=1はdeletingIdsに含まれている
    expect(helper.getDeletingIds().has(1)).toBe(true);

    // Act: deletingIdsに含まれるIDでhandleDeleteを呼ぶ
    await helper.callHandleDelete(1);

    // Assert: deleteTargetIdは変化しない（nullのまま。confirmDeleteでnullにリセット済み）
    expect(helper.getDeleteTargetId()).toBeNull();

    // クリーンアップ: 未解決のPromiseを解決
    const { act: actCleanup } = await import('react');
    await actCleanup(async () => {
      resolveDeleteRule();
      await flushPromises();
    });
  });

  it('異なるruleIdで連続して呼び出すとdeleteTargetIdが上書きされる', async () => {
    // Arrange
    await helper.render();

    // Act
    await helper.callHandleDelete(1);
    expect(helper.getDeleteTargetId()).toBe(1);

    await helper.callHandleDelete(2);

    // Assert
    expect(helper.getDeleteTargetId()).toBe(2);
  });
});
