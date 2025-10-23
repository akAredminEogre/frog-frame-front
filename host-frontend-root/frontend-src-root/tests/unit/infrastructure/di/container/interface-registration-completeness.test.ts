import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';
import 'src/infrastructure/di/container';

/**
 * DIコンテナの完全自動化インターフェース登録確認テスト
 * container.tsに登録されているインターフェースを動的に取得して自動検証する
 */
describe('DI Container - 完全自動化インターフェース登録確認テスト', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  afterEach(() => {
    container.clearInstances();
  });

  /**
   * DIコンテナから動的にインターフェーストークンを取得する
   */
  function getRegisteredInterfaceTokens(): Array<{ token: string; isInterface: boolean }> {
    const registryMap = (container as any)._registry._registryMap as Map<any, any>;
    
    return Array.from(registryMap.keys())
      .filter(token => typeof token === 'string')
      .map(token => ({ token, isInterface: true }));
  }

  const expectedInterfaceRegistrations = [
    {
      interface: 'IChromeTabsService',
      implementationName: 'ChromeTabsService'
    },
    {
      interface: 'ISelectedPageTextService',
      implementationName: 'SelectedPageTextService'
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
    }
  ];

  it('should verify expected interfaces are registered and can be resolved', () => {
    // Arrange - 開発者の意図する期待値を定義
    const expectedRegistrations = expectedInterfaceRegistrations;
    
    // Act - DIコンテナから登録済みインターフェーストークンを動的取得
    const actualRegisteredTokens = getRegisteredInterfaceTokens();
    
    console.log('=== Expected vs Actual Interface Registration Verification ===');
    console.log(`Expected registrations: ${expectedRegistrations.length}`);
    console.log(`Actual registrations: ${actualRegisteredTokens.length}`);

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredTokens).toHaveLength(expectedRegistrations.length);

    // Assert - 期待される各インターフェースが登録されていることを確認
    expectedRegistrations.forEach(({ interface: expectedInterface, implementationName }) => {
      // 期待されるインターフェースがDIコンテナに登録されているかを確認
      const isRegistered = (container as any).isRegistered(expectedInterface);
      expect(isRegistered).toBe(true);
      
      // 期待されるインターフェースが実際の登録リストに含まれているかを確認
      const foundToken = actualRegisteredTokens.find(({ token }) => token === expectedInterface);
      expect(foundToken).toBeDefined();
      expect(foundToken?.token).toBe(expectedInterface);
      
      // 期待されるインターフェースのresolveテスト
      expect(() => {
        const resolved = container.resolve(expectedInterface) as any;
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
