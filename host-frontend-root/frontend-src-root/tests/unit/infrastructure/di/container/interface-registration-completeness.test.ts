import { describe, expect, it } from 'vitest';

import { container } from 'src/frameworks-and-drivers/di/container';

/**
 * containerの内部プロパティからinterfaceToKeyMapを動的に取得する
 * tsyringeの_registry._registryMapと同様のアクセスパターン
 */
function getInterfaceToKeyMap(): Record<string, string> {
  return (container as any)._interfaceToKeyMap;
}

/**
 * containerの内部プロパティからawilixContainerを動的に取得する
 */
function getAwilixContainer(): { registrations: Record<string, unknown> } {
  return (container as any)._awilixContainer;
}

/**
 * DIコンテナから登録済みインターフェースキーの一覧を取得する
 * awilixContainerのregistrationsから動的に取得し、インターフェース関連のキーのみをフィルタ
 */
function getRegisteredInterfaceKeys(): string[] {
  const allKeys = Object.keys(getAwilixContainer().registrations);
  const interfaceKeys = Object.values(getInterfaceToKeyMap());
  return allKeys.filter(key => interfaceKeys.includes(key));
}

/**
 * DIコンテナのインターフェース登録確認テスト (Awilix)
 * container.resolve()でインターフェーストークンを解決できることを検証する
 */
describe('DI Container - インターフェース登録確認テスト (Awilix)', () => {
  /**
   * インターフェース解決テストケース
   * 各インターフェーストークンが正しい実装クラスに解決されることを検証する
   */
  const testCases = [
    {
      description: 'IChromeTabsServiceをChromeTabsServiceに解決できること',
      input: { interfaceToken: 'IChromeTabsService' as const },
      expected: { implementationName: 'ChromeTabsService' }
    },
    {
      description: 'IPopupServiceをChromePopupServiceに解決できること',
      input: { interfaceToken: 'IPopupService' as const },
      expected: { implementationName: 'ChromePopupService' }
    },
    {
      description: 'IRewriteRuleRepositoryをDexieRewriteRuleRepositoryに解決できること',
      input: { interfaceToken: 'IRewriteRuleRepository' as const },
      expected: { implementationName: 'DexieRewriteRuleRepository' }
    },
    {
      description: 'IWindowServiceをChromeWindowServiceに解決できること',
      input: { interfaceToken: 'IWindowService' as const },
      expected: { implementationName: 'ChromeWindowService' }
    },
    {
      description: 'ISelectedPageTextRepositoryをSelectedPageTextRepositoryに解決できること',
      input: { interfaceToken: 'ISelectedPageTextRepository' as const },
      expected: { implementationName: 'SelectedPageTextRepository' }
    },
    {
      description: 'ICurrentTabServiceをChromeCurrentTabServiceに解決できること',
      input: { interfaceToken: 'ICurrentTabService' as const },
      expected: { implementationName: 'ChromeCurrentTabService' }
    },
    {
      description: 'IChromeRuntimeServiceをChromeRuntimeServiceに解決できること',
      input: { interfaceToken: 'IChromeRuntimeService' as const },
      expected: { implementationName: 'ChromeRuntimeService' }
    },
    {
      description: 'IGetSelectionServiceをGetSelectionServiceに解決できること',
      input: { interfaceToken: 'IGetSelectionService' as const },
      expected: { implementationName: 'GetSelectionService' }
    },
    {
      description: 'IToggleRuleActiveControllerFactoryをToggleRuleActiveControllerFactoryに解決できること',
      input: { interfaceToken: 'IToggleRuleActiveControllerFactory' as const },
      expected: { implementationName: 'ToggleRuleActiveControllerFactory' }
    },
    {
      description: 'IDeleteRuleControllerFactoryをDeleteRuleControllerFactoryに解決できること',
      input: { interfaceToken: 'IDeleteRuleControllerFactory' as const },
      expected: { implementationName: 'DeleteRuleControllerFactory' }
    },
    {
      description: 'IExportRulesJsonControllerFactoryをExportRulesJsonControllerFactoryに解決できること',
      input: { interfaceToken: 'IExportRulesJsonControllerFactory' as const },
      expected: { implementationName: 'ExportRulesJsonControllerFactory' }
    },
    {
      description: 'IImportRulesJsonControllerFactoryをImportRulesJsonControllerFactoryに解決できること',
      input: { interfaceToken: 'IImportRulesJsonControllerFactory' as const },
      expected: { implementationName: 'ImportRulesJsonControllerFactory' }
    },
    {
      description: 'ITabsGatewayをChromeTabsGatewayに解決できること',
      input: { interfaceToken: 'ITabsGateway' as const },
      expected: { implementationName: 'ChromeTabsGateway' }
    }
  ];

  /**
   * proxy-service経由で解決されるテストケース
   * proxy-serviceはProxyオブジェクトを返すため、constructor.nameではなく
   * インターフェースのメソッドが存在することを確認する
   */
  const proxyServiceTestCases = [
    {
      description: 'IRewriteRuleMessagingPortをproxy-service経由で解決できること',
      input: { interfaceToken: 'IRewriteRuleMessagingPort' as const },
      expected: { methods: ['getById', 'updateActive'] }
    }
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const { interfaceToken } = testCase.input;
      const { implementationName } = testCase.expected;

      // Act
      const resolved = container.resolve(interfaceToken) as any;

      // Assert
      expect(resolved).toBeDefined();
      expect(resolved).not.toBeNull();
      expect(typeof resolved).toBe('object');
      expect(resolved.constructor).toBeDefined();
      expect(resolved.constructor.name).toBe(implementationName);
    });
  });

  proxyServiceTestCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const { interfaceToken } = testCase.input;
      const { methods } = testCase.expected;

      // Act
      const resolved = container.resolve(interfaceToken) as any;

      // Assert - proxy-serviceはProxyオブジェクトを返すため、メソッドの存在を確認
      expect(resolved).toBeDefined();
      expect(resolved).not.toBeNull();
      methods.forEach((method) => {
        expect(typeof resolved[method]).toBe('function');
      });
    });
  });

  /**
   * DIコンテナに登録されているインターフェース数と、テストケースで期待する数が一致することを検証
   * これにより、DIコンテナに新しいインターフェースが追加された場合にテストケースの追加漏れを検出できる
   */
  it('DIコンテナ登録数とテストケース数が一致すること', () => {
    // Act - DIコンテナから登録済みインターフェースキーを動的取得
    const actualRegisteredKeys = getRegisteredInterfaceKeys();

    // 全テストケースの合計（通常のケース + proxy-serviceケース）
    const allTestCases = [...testCases, ...proxyServiceTestCases];

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredKeys).toHaveLength(allTestCases.length);

    // Assert - 各テストケースのインターフェースがDIコンテナに登録されていることを確認
    const interfaceMapping = getInterfaceToKeyMap();
    const actualKeySet = new Set(actualRegisteredKeys);
    allTestCases.forEach(({ input: { interfaceToken } }) => {
      const expectedKey = interfaceMapping[interfaceToken];
      expect(actualKeySet.has(expectedKey),
        `Test case exists for ${interfaceToken} but key '${expectedKey}' is not registered in awilixContainer`
      ).toBe(true);
    });

    // Assert - DIコンテナに登録されている各インターフェースキーにテストケースが存在することを確認
    const testCaseKeySet = new Set<string>(
      allTestCases.map(tc => interfaceMapping[tc.input.interfaceToken])
    );
    actualRegisteredKeys.forEach((key) => {
      expect(testCaseKeySet.has(key),
        `Key '${key}' is registered in awilixContainer but missing a test case`
      ).toBe(true);
    });
  });
});
