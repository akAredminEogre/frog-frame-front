/**
 * useDeleteRule - deleteController テスト
 *
 * - onSuccessコールバックが呼ばれたときonDeleteSuccessが呼ばれる
 * - onErrorコールバックが呼ばれたときdeleteErrorが設定される
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

describe('useDeleteRule - deleteController', () => {
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

  it('onSuccessコールバックが呼ばれたときonDeleteSuccessが呼ばれる', async () => {
    // Arrange
    const mockOnDeleteSuccess = vi.fn();
    await helper.render(mockOnDeleteSuccess);

    const onSuccess = mockResult.getCapturedOnSuccess();
    expect(onSuccess).not.toBeNull();

    // Act
    await act(async () => {
      onSuccess!(42);
      await flushPromises();
    });

    // Assert
    expect(mockOnDeleteSuccess).toHaveBeenCalledWith(42);
    expect(mockOnDeleteSuccess).toHaveBeenCalledTimes(1);
  });

  it('onErrorコールバックが呼ばれたときdeleteErrorが設定される', async () => {
    // Arrange
    await helper.render();

    const onError = mockResult.getCapturedOnError();
    expect(onError).not.toBeNull();

    // Act
    await act(async () => {
      onError!(5, '削除に失敗しました');
      await flushPromises();
    });

    // Assert
    expect(helper.getDeleteError()).toEqual({
      ruleId: 5,
      message: '削除に失敗しました',
    });
  });
});
