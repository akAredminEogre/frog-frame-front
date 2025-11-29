import { contentContainer } from 'src/infrastructure/di/contentContainer';

import { describe, expect, it } from 'vitest';

import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';

/**
 * Content Script用DIコンテナのサービス登録確認テスト
 * contentContainer.tsに登録されているサービスを検証する
 */
describe('Content DI Container - サービス登録確認テスト', () => {
  const expectedServiceRegistrations = [
    {
      key: 'rewriteRuleRepository',
      implementationClass: ChromeRuntimeRewriteRuleRepository,
      implementationName: 'ChromeRuntimeRewriteRuleRepository'
    },
    {
      key: 'currentUrlService',
      implementationClass: WindowCurrentUrlService,
      implementationName: 'WindowCurrentUrlService'
    }
  ];

  it('should verify expected services are registered and can be resolved', () => {
    // Arrange
    const expectedRegistrations = expectedServiceRegistrations;

    // Act & Assert - 各サービスが登録されていて解決できることを確認
    expectedRegistrations.forEach(({ key, implementationClass, implementationName }) => {
      // Awilixコンテナに登録されているか確認
      const hasRegistration = contentContainer.hasRegistration(key);
      expect(hasRegistration).toBe(true);

      // resolveテスト
      expect(() => {
        const resolved = contentContainer.resolve(key) as any;
        expect(resolved).toBeDefined();
        expect(resolved).not.toBeNull();
        expect(typeof resolved).toBe('object');
        expect(resolved.constructor).toBeDefined();
        expect(resolved.constructor.name).toBe(implementationName);
        expect(resolved).toBeInstanceOf(implementationClass);
        console.log(`Content service ${key} resolved to ${implementationName} successfully`);
      }).not.toThrow();
    });
  });

  it('should have all expected service registrations', () => {
    // 登録されているキーの数を確認
    const registeredKeys = Object.keys(contentContainer.registrations);
    const expectedServiceKeys = expectedServiceRegistrations.map(r => r.key);

    expectedServiceKeys.forEach(key => {
      expect(registeredKeys).toContain(key);
    });
  });
});
