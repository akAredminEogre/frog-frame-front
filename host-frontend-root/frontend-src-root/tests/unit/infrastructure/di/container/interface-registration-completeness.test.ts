import { container } from 'src/infrastructure/di/container';

import { describe, expect, it } from 'vitest';

/**
 * DIコンテナのインターフェース登録確認テスト (Awilix)
 * container.resolve()でインターフェーストークンを解決できることを検証する
 */
describe('DI Container - インターフェース登録確認テスト (Awilix)', () => {
  const expectedInterfaceRegistrations = [
    {
      interface: 'IChromeTabsService',
      implementationName: 'ChromeTabsService'
    },
    {
      interface: 'IPopupService',
      implementationName: 'ChromePopupService'
    },
    {
      interface: 'IRewriteRuleRepository',
      implementationName: 'DexieRewriteRuleRepository'
    },
    {
      interface: 'IWindowService',
      implementationName: 'ChromeWindowService'
    },
    {
      interface: 'ISelectedPageTextRepository',
      implementationName: 'SelectedPageTextRepository'
    },
    {
      interface: 'ICurrentTabService',
      implementationName: 'ChromeCurrentTabService'
    },
    {
      interface: 'IChromeRuntimeService',
      implementationName: 'ChromeRuntimeService'
    },
    {
      interface: 'IGetSelectionService',
      implementationName: 'GetSelectionService'
    }
  ];

  it('should verify expected interfaces can be resolved to their implementations', () => {
    // Arrange
    const expectedRegistrations = expectedInterfaceRegistrations;

    console.log('=== Interface Resolution Verification (Awilix) ===');
    console.log(`Expected registrations: ${expectedRegistrations.length}`);

    // Assert - 期待される各インターフェースが解決できることを確認
    expectedRegistrations.forEach(({ interface: expectedInterface, implementationName }) => {
      expect(() => {
        const resolved = container.resolve(expectedInterface as any) as any;
        expect(resolved).toBeDefined();
        expect(resolved).not.toBeNull();
        expect(typeof resolved).toBe('object');
        expect(resolved.constructor).toBeDefined();
        expect(resolved.constructor.name).toBe(implementationName);
        console.log(`Expected interface ${expectedInterface} resolved to ${implementationName} successfully`);
      }).not.toThrow();
    });
  });
});
