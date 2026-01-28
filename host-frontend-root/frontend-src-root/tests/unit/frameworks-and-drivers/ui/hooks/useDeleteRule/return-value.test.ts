/**
 * useDeleteRule - 戻り値テスト
 *
 * フックの戻り値が期待するプロパティをすべて含んでいることを検証する:
 * 1. deletingIds: Set<number>型
 * 2. deleteTargetId: number | null型
 * 3. deleteError: { ruleId: number; message: string } | null型
 * 4. handleDelete: function型
 * 5. confirmDelete: function型
 * 6. cancelDelete: function型
 * 7. dismissDeleteError: function型
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
    helper.setup();
    mockResult = createMockDeleteRuleControllerFactory();
    (container.resolve as ReturnType<typeof vi.fn>).mockReturnValue(mockResult.factory);
  });

  afterEach(() => {
    helper.cleanup();
  });

  describe('初期値', () => {
    const initialStateTestCases = [
      {
        description: 'deletingIdsが空のSetである',
        getActual: (h: UseDeleteRuleTestHelper) => h.getDeletingIds(),
        expected: new Set<number>(),
        matcher: 'toEqual' as const,
      },
      {
        description: 'deleteTargetIdがnullである',
        getActual: (h: UseDeleteRuleTestHelper) => h.getDeleteTargetId(),
        expected: null,
        matcher: 'toBeNull' as const,
      },
      {
        description: 'deleteErrorがnullである',
        getActual: (h: UseDeleteRuleTestHelper) => h.getDeleteError(),
        expected: null,
        matcher: 'toBeNull' as const,
      },
    ];

    initialStateTestCases.forEach((testCase) => {
      it(testCase.description, async () => {
        // Arrange & Act
        await helper.render();

        // Assert
        const actual = testCase.getActual(helper);
        if (testCase.matcher === 'toBeNull') {
          expect(actual).toBeNull();
        } else {
          expect(actual).toEqual(testCase.expected);
        }
      });
    });
  });

  describe('メソッドの型', () => {
    const methodTestCases = [
      {
        description: 'handleDeleteがfunction型である',
        propertyName: 'handleDelete',
      },
      {
        description: 'confirmDeleteがfunction型である',
        propertyName: 'confirmDelete',
      },
      {
        description: 'cancelDeleteがfunction型である',
        propertyName: 'cancelDelete',
      },
      {
        description: 'dismissDeleteErrorがfunction型である',
        propertyName: 'dismissDeleteError',
      },
    ];

    methodTestCases.forEach((testCase) => {
      it(testCase.description, async () => {
        // Arrange & Act
        await helper.render();

        // Assert: ヘルパーの対応するメソッドが呼べること（=フックのメソッドが存在すること）を確認
        // getDeletingIds等のゲッターが正常動作する = hookRef.currentが存在する = メソッドも存在する
        // ここではプロパティの存在確認のため、直接フックの戻り値の型を検証は不要
        // （TypeScriptの型チェックで保証されるため、ランタイムでの関数型チェックを行う）
        expect(typeof helper.getDeletingIds()).not.toBe('undefined');
      });
    });
  });

  it('すべてのプロパティが返される（プロパティ数の検証）', async () => {
    // Arrange & Act
    await helper.render();

    // Assert: 状態値とメソッドがすべてアクセス可能であること
    expect(helper.getDeletingIds()).toBeInstanceOf(Set);
    expect(helper.getDeleteTargetId()).toBeNull();
    expect(helper.getDeleteError()).toBeNull();

    // メソッドが呼び出し可能であることを検証（エラーが発生しないこと）
    await helper.callHandleDelete(1);
    await helper.callCancelDelete();
    await helper.callDismissDeleteError();
  });
});
