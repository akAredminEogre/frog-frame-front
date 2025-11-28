import 'src/infrastructure/di/contentContainer';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ApplyRulesOnPageLoadUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase';
import { contentContainer } from 'src/infrastructure/di/contentContainer';

/**
 * Content Script用DIコンテナの完全自動化具体クラス登録確認テスト
 * contentContainer.tsに登録されている具体クラスを動的に取得して自動検証する
 */
describe('Content DI Container - 完全自動化具体クラス登録確認テスト', () => {
  beforeEach(() => {
    contentContainer.clearInstances();
  });

  afterEach(() => {
    contentContainer.clearInstances();
  });

  /**
   * Content Script用DIコンテナから動的に具体クラストークンを取得する
   * 注意: contentContainerは子コンテナのため、親コンテナの登録も含まれる
   * ここでは子コンテナで登録された具体クラスのみを検証対象とする
   */
  function getRegisteredConcreteClassTokens(): Array<{ token: any; isInterface: boolean }> {
    const registryMap = (contentContainer as any)._registry._registryMap as Map<any, any>;

    return Array.from(registryMap.keys())
      .filter(token => typeof token !== 'string')
      .map(token => ({ token, isInterface: false }));
  }

  const expectedConcreteClassRegistrations = [
    {
      class: ApplyRulesOnPageLoadUseCase,
      className: 'ApplyRulesOnPageLoadUseCase'
    }
  ];

  it('should verify expected concrete classes are registered and can be resolved', () => {
    // Arrange - 開発者の意図する期待値を定義
    const expectedRegistrations = expectedConcreteClassRegistrations;

    // Act - DIコンテナから登録済み具体クラストークンを動的取得
    const actualRegisteredTokens = getRegisteredConcreteClassTokens();

    console.log('=== Expected vs Actual Concrete Class Registration Verification (Content Container) ===');
    console.log(`Expected registrations: ${expectedRegistrations.length}`);
    console.log(`Actual registrations: ${actualRegisteredTokens.length}`);

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredTokens).toHaveLength(expectedRegistrations.length);

    // Assert - 期待される各具体クラスが登録されていることを確認
    expectedRegistrations.forEach(({ class: expectedClass, className }) => {
      // 期待されるクラスがDIコンテナに登録されているかを確認
      const isRegistered = (contentContainer as any).isRegistered(expectedClass);
      expect(isRegistered).toBe(true);

      // 期待されるクラスが実際の登録リストに含まれているかを確認
      const foundToken = actualRegisteredTokens.find(({ token }) => token === expectedClass);
      expect(foundToken).toBeDefined();
      expect(foundToken?.token.name).toBe(className);

      // 期待されるクラスのresolveテスト
      expect(() => {
        const resolved = contentContainer.resolve(expectedClass as any) as any;
        expect(resolved).toBeDefined();
        expect(resolved).not.toBeNull();
        expect(resolved).toBeInstanceOf(expectedClass);
        console.log(`Expected class ${className} resolved successfully`);
      }).not.toThrow();
    });
  });
});
