import { container } from 'src/infrastructure/di/container';

import { describe, expect, it } from 'vitest';

import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';

/**
 * DIコンテナの具体クラス登録確認テスト (Awilix)
 * container.resolve()で具体クラスを解決できることを検証する
 */
describe('DI Container - 具体クラス登録確認テスト (Awilix)', () => {
  /**
   * 具体クラス解決テストケース
   * 各クラスがcontainer.resolve()で正しく解決できることを検証する
   */
  const testCases = [
    {
      description: 'HandleContextMenuReplaceDomElementを解決できること',
      input: { classToken: HandleContextMenuReplaceDomElement },
      expected: { className: 'HandleContextMenuReplaceDomElement' }
    },
    {
      description: 'ContextMenuSetupUseCaseを解決できること',
      input: { classToken: ContextMenuSetupUseCase },
      expected: { className: 'ContextMenuSetupUseCase' }
    },
    {
      description: 'DexieRewriteRuleRepositoryを解決できること',
      input: { classToken: DexieRewriteRuleRepository },
      expected: { className: 'DexieRewriteRuleRepository' }
    },
    {
      description: 'LoadRewriteRuleForEditUseCaseを解決できること',
      input: { classToken: LoadRewriteRuleForEditUseCase },
      expected: { className: 'LoadRewriteRuleForEditUseCase' }
    },
    {
      description: 'UpdateRewriteRuleUseCaseを解決できること',
      input: { classToken: UpdateRewriteRuleUseCase },
      expected: { className: 'UpdateRewriteRuleUseCase' }
    },
    {
      description: 'CloseCurrentWindowUseCaseを解決できること',
      input: { classToken: CloseCurrentWindowUseCase },
      expected: { className: 'CloseCurrentWindowUseCase' }
    },
    {
      description: 'SaveRewriteRuleAndApplyToCurrentTabUseCaseを解決できること',
      input: { classToken: SaveRewriteRuleAndApplyToCurrentTabUseCase },
      expected: { className: 'SaveRewriteRuleAndApplyToCurrentTabUseCase' }
    },
    {
      description: 'PopupInitFormUseCaseを解決できること',
      input: { classToken: PopupInitFormUseCase },
      expected: { className: 'PopupInitFormUseCase' }
    }
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const { classToken } = testCase.input;
      const { className } = testCase.expected;

      // Act
      const resolved = container.resolve<InstanceType<typeof classToken>>(classToken);

      // Assert
      expect(resolved).toBeDefined();
      expect(resolved).not.toBeNull();
      expect(resolved).toBeInstanceOf(classToken);
      expect((resolved as any).constructor.name).toBe(className);
    });
  });
});
