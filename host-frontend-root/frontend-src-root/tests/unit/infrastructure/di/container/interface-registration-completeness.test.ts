import { awilixContainer, container } from 'src/infrastructure/di/container';

import { describe, expect, it } from 'vitest';

/**
 * インターフェーストークンとAwilix登録キーのマッピング
 * container.tsのinterfaceToKeyMapと同じマッピングを定義
 */
const interfaceTokenToKeyMap: Record<string, string> = {
  'IChromeTabsService': 'chromeTabsService',
  'IPopupService': 'popupService',
  'IRewriteRuleRepository': 'rewriteRuleRepository',
  'IWindowService': 'windowService',
  'ISelectedPageTextRepository': 'selectedPageTextRepository',
  'ICurrentTabService': 'currentTabService',
  'IChromeRuntimeService': 'chromeRuntimeService',
  'IGetSelectionService': 'getSelectionService'
};

/**
 * DIコンテナから登録済みインターフェースキーの一覧を取得する
 * awilixContainerのregistrationsから動的に取得し、インターフェース関連のキーのみをフィルタ
 */
function getRegisteredInterfaceKeys(): string[] {
  const allKeys = Object.keys(awilixContainer.registrations);
  const interfaceKeys = Object.values(interfaceTokenToKeyMap);
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

  /**
   * DIコンテナに登録されているインターフェース数と、テストケースで期待する数が一致することを検証
   * これにより、DIコンテナに新しいインターフェースが追加された場合にテストケースの追加漏れを検出できる
   */
  it('DIコンテナ登録数とテストケース数が一致すること', () => {
    // Act - DIコンテナから登録済みインターフェースキーを動的取得
    const actualRegisteredKeys = getRegisteredInterfaceKeys();

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredKeys).toHaveLength(testCases.length);

    // Assert - 各テストケースのインターフェースがDIコンテナに登録されていることを確認
    const actualKeySet = new Set(actualRegisteredKeys);
    testCases.forEach(({ input: { interfaceToken } }) => {
      const expectedKey = interfaceTokenToKeyMap[interfaceToken];
      expect(actualKeySet.has(expectedKey),
        `Test case exists for ${interfaceToken} but key '${expectedKey}' is not registered in awilixContainer`
      ).toBe(true);
    });

    // Assert - DIコンテナに登録されている各インターフェースキーにテストケースが存在することを確認
    const testCaseKeySet = new Set<string>(
      testCases.map(tc => interfaceTokenToKeyMap[tc.input.interfaceToken])
    );
    actualRegisteredKeys.forEach((key) => {
      expect(testCaseKeySet.has(key),
        `Key '${key}' is registered in awilixContainer but missing a test case`
      ).toBe(true);
    });
  });
});
