import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';
import 'src/infrastructure/di/container';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';

/**
 * DIコンテナの完全自動化具体クラス登録確認テスト
 * container.tsに登録されている具体クラスを動的に取得して自動検証する
 */
describe('DI Container - 完全自動化具体クラス登録確認テスト', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  afterEach(() => {
    container.clearInstances();
  });

  /**
   * DIコンテナから動的に具体クラストークンを取得する
   */
  function getRegisteredConcreteClassTokens(): Array<{ token: any; isInterface: boolean }> {
    const registryMap = (container as any)._registry._registryMap as Map<any, any>;
    
    return Array.from(registryMap.keys())
      .filter(token => typeof token !== 'string')
      .map(token => ({ token, isInterface: false }));
  }

  const expectedConcreteClassRegistrations = [
    {
      class: HandleContextMenuReplaceDomElement,
      className: 'HandleContextMenuReplaceDomElement'
    },
    {
      class: ContextMenuSetupUseCase,
      className: 'ContextMenuSetupUseCase'  
    }
  ];

  it('should verify expected concrete classes are registered and can be resolved', () => {
    // Arrange - 開発者の意図する期待値を定義
    const expectedRegistrations = expectedConcreteClassRegistrations;
    
    // Act - DIコンテナから登録済み具体クラストークンを動的取得
    const actualRegisteredTokens = getRegisteredConcreteClassTokens();
    
    console.log('=== Expected vs Actual Concrete Class Registration Verification ===');
    console.log(`Expected registrations: ${expectedRegistrations.length}`);
    console.log(`Actual registrations: ${actualRegisteredTokens.length}`);

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredTokens).toHaveLength(expectedRegistrations.length);

    // Assert - 期待される各具体クラスが登録されていることを確認
    expectedRegistrations.forEach(({ class: expectedClass, className }) => {
      // 期待されるクラスがDIコンテナに登録されているかを確認
      const isRegistered = (container as any).isRegistered(expectedClass);
      expect(isRegistered).toBe(true);
      
      // 期待されるクラスが実際の登録リストに含まれているかを確認
      const foundToken = actualRegisteredTokens.find(({ token }) => token === expectedClass);
      expect(foundToken).toBeDefined();
      expect(foundToken?.token.name).toBe(className);
      
      // 期待されるクラスのresolveテスト
      expect(() => {
        const resolved = container.resolve(expectedClass as any) as any;
        expect(resolved).toBeDefined();
        expect(resolved).not.toBeNull();
        expect(resolved).toBeInstanceOf(expectedClass);
        console.log(`Expected class ${className} resolved successfully`);
      }).not.toThrow();
    });
  });

});
