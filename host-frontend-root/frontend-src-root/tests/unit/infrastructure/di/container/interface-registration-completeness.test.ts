import { container, interfaceToKeyMap } from 'src/infrastructure/di/container';

import { describe, expect, it } from 'vitest';

/**
 * DIコンテナから登録済みインターフェーストークンの一覧を取得する
 * container.tsのinterfaceToKeyMapから動的に取得
 */
function getRegisteredInterfaceTokens(): Array<{ token: string; key: string }> {
  return Object.entries(interfaceToKeyMap).map(([token, key]) => ({ token, key }));
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
    // Act - DIコンテナから登録済みインターフェーストークンを動的取得
    const actualRegisteredTokens = getRegisteredInterfaceTokens();

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredTokens).toHaveLength(testCases.length);

    // Assert - 各インターフェースがDIコンテナに登録されていることを確認
    const actualTokenSet = new Set(actualRegisteredTokens.map(({ token }) => token));
    testCases.forEach(({ input: { interfaceToken } }) => {
      expect(actualTokenSet.has(interfaceToken),
        `Test case exists for ${interfaceToken} but it's not registered in interfaceToKeyMap`
      ).toBe(true);
    });

    // Assert - DIコンテナに登録されている各インターフェースにテストケースが存在することを確認
    const testCaseTokenSet = new Set<string>(testCases.map(tc => tc.input.interfaceToken));
    actualRegisteredTokens.forEach(({ token }) => {
      expect(testCaseTokenSet.has(token),
        `Interface ${token} is registered in interfaceToKeyMap but missing a test case`
      ).toBe(true);
    });
  });
});
