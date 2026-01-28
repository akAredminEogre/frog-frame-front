/**
 * useDeleteRule - deleteController テスト
 *
 * ファクトリとコントローラの連携を検証する:
 * 1. factory.createがコールバック付きで呼ばれる
 * 2. onSuccessコールバックがonDeleteSuccessを呼び出す
 * 3. onErrorコールバックがdeleteErrorを設定する
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

  it('container.resolveがIDeleteRuleControllerFactoryキーで呼ばれる', async () => {
    // Act
    await helper.render();

    // Assert
    expect(container.resolve).toHaveBeenCalledWith('IDeleteRuleControllerFactory');
  });

  it('factory.createがコールバック付きで呼ばれる', async () => {
    // Act
    await helper.render();

    // Assert
    expect(mockResult.factory.create).toHaveBeenCalledTimes(1);
    expect(mockResult.factory.create).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  describe('onSuccessコールバック', () => {
    it('onSuccessが呼ばれるとonDeleteSuccessが同じruleIdで呼ばれる', async () => {
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

    const successTestCases = [
      { description: 'ruleId=1でonDeleteSuccessが呼ばれる', ruleId: 1 },
      { description: 'ruleId=100でonDeleteSuccessが呼ばれる', ruleId: 100 },
    ];

    successTestCases.forEach((testCase) => {
      it(testCase.description, async () => {
        // Arrange
        const mockOnDeleteSuccess = vi.fn();
        await helper.render(mockOnDeleteSuccess);

        const onSuccess = mockResult.getCapturedOnSuccess();

        // Act
        await act(async () => {
          onSuccess!(testCase.ruleId);
          await flushPromises();
        });

        // Assert
        expect(mockOnDeleteSuccess).toHaveBeenCalledWith(testCase.ruleId);
      });
    });
  });

  describe('onErrorコールバック', () => {
    it('onErrorが呼ばれるとdeleteErrorが設定される', async () => {
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

    const errorTestCases = [
      {
        description: 'ruleId=1, メッセージ「ネットワークエラー」でdeleteErrorが設定される',
        ruleId: 1,
        message: 'ネットワークエラー',
      },
      {
        description: 'ruleId=99, メッセージ「権限がありません」でdeleteErrorが設定される',
        ruleId: 99,
        message: '権限がありません',
      },
    ];

    errorTestCases.forEach((testCase) => {
      it(testCase.description, async () => {
        // Arrange
        await helper.render();

        const onError = mockResult.getCapturedOnError();

        // Act
        await act(async () => {
          onError!(testCase.ruleId, testCase.message);
          await flushPromises();
        });

        // Assert
        expect(helper.getDeleteError()).toEqual({
          ruleId: testCase.ruleId,
          message: testCase.message,
        });
      });
    });
  });

  it('dismissDeleteErrorを呼ぶとdeleteErrorがnullにリセットされる', async () => {
    // Arrange
    await helper.render();

    const onError = mockResult.getCapturedOnError();
    await act(async () => {
      onError!(3, 'エラー発生');
      await flushPromises();
    });
    expect(helper.getDeleteError()).not.toBeNull();

    // Act
    await helper.callDismissDeleteError();

    // Assert
    expect(helper.getDeleteError()).toBeNull();
  });
});
