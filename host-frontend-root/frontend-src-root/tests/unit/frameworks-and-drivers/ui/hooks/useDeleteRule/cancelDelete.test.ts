/**
 * useDeleteRule - cancelDelete テスト
 *
 * cancelDeleteメソッドの動作を検証する:
 * 1. deleteTargetIdがnullにリセットされる
 * 2. handleDelete後にcancelDeleteを呼ぶとdeleteTargetIdがnullになる
 * 3. deleteTargetIdが既にnullの場合も安全に呼べる
 */
import {
  createMockDeleteRuleControllerFactory,
  MockDeleteRuleControllerFactoryResult,
} from 'tests/unit/frameworks-and-drivers/ui/hooks/useDeleteRule/mocks/createMockDeleteRuleControllerFactory';
import { UseDeleteRuleTestHelper } from 'tests/unit/frameworks-and-drivers/ui/hooks/useDeleteRule/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { container } from 'src/frameworks-and-drivers/di/container';

vi.mock('src/frameworks-and-drivers/di/container', () => ({
  container: {
    resolve: vi.fn(),
  },
}));

describe('useDeleteRule - cancelDelete', () => {
  const helper = new UseDeleteRuleTestHelper();
  let mockResult: MockDeleteRuleControllerFactoryResult;

  beforeEach(() => {
    vi.clearAllMocks();
    helper.setup();
    mockResult = createMockDeleteRuleControllerFactory();
    (container.resolve as ReturnType<typeof vi.fn>).mockReturnValue(mockResult.factory);
  });

  afterEach(() => {
    helper.cleanup();
    vi.resetAllMocks();
  });

  it('handleDelete後にcancelDeleteを呼ぶとdeleteTargetIdがnullになる', async () => {
    // Arrange
    await helper.render();
    await helper.callHandleDelete(5);
    expect(helper.getDeleteTargetId()).toBe(5);

    // Act
    await helper.callCancelDelete();

    // Assert
    expect(helper.getDeleteTargetId()).toBeNull();
  });

  it('deleteTargetIdが既にnullの場合も安全に呼べる', async () => {
    // Arrange
    await helper.render();
    expect(helper.getDeleteTargetId()).toBeNull();

    // Act & Assert: エラーが発生しないこと
    await helper.callCancelDelete();
    expect(helper.getDeleteTargetId()).toBeNull();
  });

  it('cancelDelete後にhandleDeleteで新しいIDを設定できる', async () => {
    // Arrange
    await helper.render();
    await helper.callHandleDelete(10);
    await helper.callCancelDelete();
    expect(helper.getDeleteTargetId()).toBeNull();

    // Act
    await helper.callHandleDelete(20);

    // Assert
    expect(helper.getDeleteTargetId()).toBe(20);
  });
});
