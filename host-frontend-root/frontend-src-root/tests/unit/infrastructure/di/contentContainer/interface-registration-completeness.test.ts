import 'src/infrastructure/di/contentContainer';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { contentContainer } from 'src/infrastructure/di/contentContainer';

/**
 * Content Script用DIコンテナの完全自動化インターフェース登録確認テスト
 * contentContainer.tsに登録されているインターフェースを動的に取得して自動検証する
 */
describe('Content DI Container - 完全自動化インターフェース登録確認テスト', () => {
  beforeEach(() => {
    contentContainer.clearInstances();
  });

  afterEach(() => {
    contentContainer.clearInstances();
  });

  /**
   * Content Script用DIコンテナから動的にインターフェーストークンを取得する
   * 注意: contentContainerは子コンテナのため、親コンテナの登録も含まれる
   * ここでは子コンテナで上書きされた登録のみを検証対象とする
   */
  function getRegisteredInterfaceTokens(): Array<{ token: string; isInterface: boolean }> {
    const registryMap = (contentContainer as any)._registry._registryMap as Map<any, any>;

    return Array.from(registryMap.keys())
      .filter(token => typeof token === 'string')
      .map(token => ({ token, isInterface: true }));
  }

  const expectedInterfaceRegistrations = [
    {
      interface: 'IRewriteRuleRepository',
      implementationName: 'ChromeRuntimeRewriteRuleRepository'
    },
    {
      interface: 'ICurrentTabService',
      implementationName: 'ChromeCurrentTabService'
    },
    {
      interface: 'IDebounceTimer',
      implementationName: 'DebounceTimer'
    }
  ];

  it('should verify expected interfaces are registered and can be resolved', () => {
    // Arrange - 開発者の意図する期待値を定義
    const expectedRegistrations = expectedInterfaceRegistrations;

    // Act - DIコンテナから登録済みインターフェーストークンを動的取得
    const actualRegisteredTokens = getRegisteredInterfaceTokens();

    console.log('=== Expected vs Actual Interface Registration Verification (Content Container) ===');
    console.log(`Expected registrations: ${expectedRegistrations.length}`);
    console.log(`Actual registrations: ${actualRegisteredTokens.length}`);

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredTokens).toHaveLength(expectedRegistrations.length);

    // Assert - 期待される各インターフェースが登録されていることを確認
    expectedRegistrations.forEach(({ interface: expectedInterface, implementationName }) => {
      // 期待されるインターフェースがDIコンテナに登録されているかを確認
      const isRegistered = (contentContainer as any).isRegistered(expectedInterface);
      expect(isRegistered).toBe(true);

      // 期待されるインターフェースが実際の登録リストに含まれているかを確認
      const foundToken = actualRegisteredTokens.find(({ token }) => token === expectedInterface);
      expect(foundToken).toBeDefined();
      expect(foundToken?.token).toBe(expectedInterface);

      // 期待されるインターフェースのresolveテスト
      expect(() => {
        const resolved = contentContainer.resolve(expectedInterface) as any;
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
