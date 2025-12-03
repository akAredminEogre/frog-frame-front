import { classToKeyMap, container } from 'src/infrastructure/di/container';

import { describe, expect, it } from 'vitest';

import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';

/**
 * DIコンテナから登録済み具体クラストークンの一覧を取得する
 * container.tsのclassToKeyMapから動的に取得
 */
function getRegisteredConcreteClassTokens(): Array<{ token: Function; key: string }> {
  return Array.from(classToKeyMap.entries()).map(([token, key]) => ({ token, key }));
}

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
    },
    {
      description: 'ChromeTabsServiceを解決できること',
      input: { classToken: ChromeTabsService },
      expected: { className: 'ChromeTabsService' }
    },
    {
      description: 'ChromeCurrentTabServiceを解決できること',
      input: { classToken: ChromeCurrentTabService },
      expected: { className: 'ChromeCurrentTabService' }
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

  /**
   * DIコンテナに登録されている具体クラス数と、テストケースで期待する数が一致することを検証
   * これにより、DIコンテナに新しいクラスが追加された場合にテストケースの追加漏れを検出できる
   */
  it('DIコンテナ登録数とテストケース数が一致すること', () => {
    // Act - DIコンテナから登録済み具体クラストークンを動的取得
    const actualRegisteredTokens = getRegisteredConcreteClassTokens();

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredTokens).toHaveLength(testCases.length);

    // Assert - 各具体クラスがDIコンテナに登録されていることを確認
    const actualTokenSet = new Set(actualRegisteredTokens.map(({ token }) => token));
    testCases.forEach(({ input: { classToken } }) => {
      expect(actualTokenSet.has(classToken),
        `Test case exists for ${classToken.name} but it's not registered in classToKeyMap`
      ).toBe(true);
    });

    // Assert - DIコンテナに登録されている各クラスにテストケースが存在することを確認
    const testCaseTokenSet = new Set(testCases.map(tc => tc.input.classToken));
    actualRegisteredTokens.forEach(({ token }) => {
      expect(testCaseTokenSet.has(token),
        `Class ${(token as any).name} is registered in classToKeyMap but missing a test case`
      ).toBe(true);
    });
});
