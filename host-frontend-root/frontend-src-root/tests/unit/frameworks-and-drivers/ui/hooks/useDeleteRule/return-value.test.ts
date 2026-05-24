/**
 * useDeleteRule - 戻り値テスト
 *
 * - 必要なプロパティがすべて含まれる
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

describe('useDeleteRule - 戻り値', () => {
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

  it('必要なプロパティがすべて含まれる', async () => {
    // Arrange & Act
    await helper.render();

    // Assert: 状態値が正しい型で返される
    expect(helper.getDeletingIds()).toBeInstanceOf(Set);
    expect(helper.getDeleteTargetId()).toBeNull();
    expect(helper.getDeleteError()).toBeNull();

    // Assert: メソッドがfunction型で返される
    const result = helper.getHookResult();
    expect(typeof result.handleDelete).toBe('function');
    expect(typeof result.confirmDelete).toBe('function');
    expect(typeof result.cancelDelete).toBe('function');
    expect(typeof result.dismissDeleteError).toBe('function');
  });
});
