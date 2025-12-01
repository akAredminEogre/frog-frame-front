import { container } from 'src/infrastructure/di/container';

import { describe, expect, it } from 'vitest';

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
});
