import { describe, expect, it } from 'vitest';

import { contentContainer } from 'src/infrastructure/di/contentContainer';

/**
 * contentContainerの内部プロパティからinterfaceToKeyMapを動的に取得する
 * tsyringeの_registry._registryMapと同様のアクセスパターン
 */
function getInterfaceToKeyMap(): Record<string, string> {
  return (contentContainer as any)._interfaceToKeyMap;
}

/**
 * contentContainerの内部プロパティからawilixContainerを動的に取得する
 */
function getAwilixContainer(): { registrations: Record<string, unknown> } {
  return (contentContainer as any)._awilixContainer;
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
 * Content Script用DIコンテナのインターフェース登録確認テスト (Awilix)
 * contentContainer.resolve()でインターフェーストークンを解決できることを検証する
 */
describe('Content DI Container - インターフェース登録確認テスト (Awilix)', () => {
  /**
   * インターフェース解決テストケース
   * 各インターフェーストークンが正しい実装クラスに解決されることを検証する
   */
  const testCases = [
    {
      description: 'IRewriteRuleRepositoryをChromeRuntimeRewriteRuleRepositoryに解決できること',
      input: { interfaceToken: 'IRewriteRuleRepository' as const },
      expected: { implementationName: 'ChromeRuntimeRewriteRuleRepository' }
    },
    {
      description: 'ICurrentUrlServiceをWindowCurrentUrlServiceに解決できること',
      input: { interfaceToken: 'ICurrentUrlService' as const },
      expected: { implementationName: 'WindowCurrentUrlService' }
    },
    {
      description: 'IDebounceTimerをDebounceTimerに解決できること',
      input: { interfaceToken: 'IDebounceTimer' as const },
      expected: { implementationName: 'DebounceTimer' }
    },
    {
      description: 'IObserverControlをobserverControlに解決できること',
      input: { interfaceToken: 'IObserverControl' as const },
      expected: { implementationName: 'Object' }
    },
    {
      description: 'IGetSelectionServiceをGetSelectionServiceに解決できること',
      input: { interfaceToken: 'IGetSelectionService' as const },
      expected: { implementationName: 'GetSelectionService' }
    },
    {
      description: 'IDomRootCheckerをDomRootCheckerに解決できること',
      input: { interfaceToken: 'IDomRootChecker' as const },
      expected: { implementationName: 'DomRootChecker' }
    }
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const { interfaceToken } = testCase.input;
      const { implementationName } = testCase.expected;

      // Act
      const resolved = contentContainer.resolve(interfaceToken) as any;

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
    const interfaceMapping = getInterfaceToKeyMap();
    const actualKeySet = new Set(actualRegisteredKeys);
    testCases.forEach(({ input: { interfaceToken } }) => {
      const expectedKey = interfaceMapping[interfaceToken];
      expect(actualKeySet.has(expectedKey),
        `Test case exists for ${interfaceToken} but key '${expectedKey}' is not registered in awilixContainer`
      ).toBe(true);
    });

    // Assert - DIコンテナに登録されている各インターフェースキーにテストケースが存在することを確認
    const testCaseKeySet = new Set<string>(
      testCases.map(tc => interfaceMapping[tc.input.interfaceToken])
    );
    actualRegisteredKeys.forEach((key) => {
      expect(testCaseKeySet.has(key),
        `Key '${key}' is registered in awilixContainer but missing a test case`
      ).toBe(true);
    });
  });
});
