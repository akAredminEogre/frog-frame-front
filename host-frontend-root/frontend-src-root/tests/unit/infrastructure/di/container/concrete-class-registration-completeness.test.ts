import { describe, expect, it } from 'vitest';

import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { ChromeTabsGateway } from 'src/frameworks-and-drivers/browser/ChromeTabsGateway';
import { container } from 'src/frameworks-and-drivers/di/container';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { DeleteRuleControllerFactory } from 'src/interface-adapters/factories/DeleteRuleControllerFactory';
import { ExportRulesJsonControllerFactory } from 'src/interface-adapters/factories/ExportRulesJsonControllerFactory';
import { ImportRulesJsonControllerFactory } from 'src/interface-adapters/factories/ImportRulesJsonControllerFactory';
import { ToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/ToggleRuleActiveControllerFactory';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';

/**
 * containerの内部プロパティからclassToKeyMapを動的に取得する
 * tsyringeの_registry._registryMapと同様のアクセスパターン
 */
function getClassToKeyMap(): Map<Function, string> {
  return (container as any)._classToKeyMap;
}

/**
 * DIコンテナから登録済み具体クラストークンの一覧を取得する
 * container.tsのclassToKeyMapから動的に取得
 */
function getRegisteredConcreteClassTokens(): Array<{ token: Function; key: string }> {
  return Array.from(getClassToKeyMap().entries()).map(([token, key]) => ({ token, key }));
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
    },
    {
      description: 'ToggleRuleActiveControllerFactoryを解決できること',
      input: { classToken: ToggleRuleActiveControllerFactory },
      expected: { className: 'ToggleRuleActiveControllerFactory' }
    },
    {
      description: 'DeleteRuleControllerFactoryを解決できること',
      input: { classToken: DeleteRuleControllerFactory },
      expected: { className: 'DeleteRuleControllerFactory' }
    },
    {
      description: 'ExportRulesJsonControllerFactoryを解決できること',
      input: { classToken: ExportRulesJsonControllerFactory },
      expected: { className: 'ExportRulesJsonControllerFactory' }
    },
    {
      description: 'ImportRulesJsonControllerFactoryを解決できること',
      input: { classToken: ImportRulesJsonControllerFactory },
      expected: { className: 'ImportRulesJsonControllerFactory' }
    },
    {
      description: 'RewriteRuleMapperを解決できること',
      input: { classToken: RewriteRuleMapper },
      expected: { className: 'RewriteRuleMapper' }
    },
    {
      description: 'ChromeTabsGatewayを解決できること',
      input: { classToken: ChromeTabsGateway },
      expected: { className: 'ChromeTabsGateway' }
    }
  ];

  /**
   * proxy-service経由で解決されるテストケース
   * proxy-serviceはProxyオブジェクトを返すため、toBeInstanceOfではなく
   * インターフェースのメソッドが存在することを確認する
   */
  const proxyServiceTestCases = [
    {
      description: 'RewriteRuleMessagingServiceを解決できること（proxy-service経由）',
      input: { classToken: RewriteRuleMessagingService },
      expected: { methods: ['getById', 'updateActive'] }
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

  proxyServiceTestCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const { classToken } = testCase.input;
      const { methods } = testCase.expected;

      // Act
      const resolved = container.resolve(classToken) as any;

      // Assert - proxy-serviceはProxyオブジェクトを返すため、メソッドの存在を確認
      expect(resolved).toBeDefined();
      expect(resolved).not.toBeNull();
      methods.forEach((method) => {
        expect(typeof resolved[method]).toBe('function');
      });
    });
  });

  /**
   * DIコンテナに登録されている具体クラス数と、テストケースで期待する数が一致することを検証
   * これにより、DIコンテナに新しいクラスが追加された場合にテストケースの追加漏れを検出できる
   */
  it('DIコンテナ登録数とテストケース数が一致すること', () => {
    // Act - DIコンテナから登録済み具体クラストークンを動的取得
    const actualRegisteredTokens = getRegisteredConcreteClassTokens();

    // 全テストケースの合計（通常のケース + proxy-serviceケース）
    const allTestCases = [...testCases, ...proxyServiceTestCases];

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredTokens).toHaveLength(allTestCases.length);

    // Assert - 各具体クラスがDIコンテナに登録されていることを確認
    const actualTokenSet = new Set(actualRegisteredTokens.map(({ token }) => token));
    allTestCases.forEach(({ input: { classToken } }) => {
      expect(actualTokenSet.has(classToken),
        `Test case exists for ${classToken.name} but it's not registered in classToKeyMap`
      ).toBe(true);
    });

    // Assert - DIコンテナに登録されている各クラスにテストケースが存在することを確認
    const testCaseTokenSet = new Set<Function>(allTestCases.map(tc => tc.input.classToken));
    actualRegisteredTokens.forEach(({ token }) => {
      expect(testCaseTokenSet.has(token),
        `Class ${(token as any).name} is registered in classToKeyMap but missing a test case`
      ).toBe(true);
    });
  });
});
