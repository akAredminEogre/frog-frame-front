import { container } from 'src/infrastructure/di/container';

import { describe, expect, it } from 'vitest';

import { ChromePopupService } from 'src/infrastructure/browser/popup/ChromePopupService';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { ChromeWindowService } from 'src/infrastructure/browser/window/ChromeWindowService';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { SelectedPageTextRepository } from 'src/infrastructure/persistence/storage/SelectedPageTextRepository';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';

/**
 * DIコンテナのインフラストラクチャサービス登録確認テスト
 * container.tsに登録されているインフラサービスを検証する
 */
describe('DI Container - インフラストラクチャサービス登録確認テスト', () => {
  const expectedServiceRegistrations = [
    {
      key: 'tabsService',
      implementationClass: ChromeTabsService,
      implementationName: 'ChromeTabsService'
    },
    {
      key: 'popupService',
      implementationClass: ChromePopupService,
      implementationName: 'ChromePopupService'
    },
    {
      key: 'rewriteRuleRepository',
      implementationClass: DexieRewriteRuleRepository,
      implementationName: 'DexieRewriteRuleRepository'
    },
    {
      key: 'windowService',
      implementationClass: ChromeWindowService,
      implementationName: 'ChromeWindowService'
    },
    {
      key: 'selectedPageTextRepository',
      implementationClass: SelectedPageTextRepository,
      implementationName: 'SelectedPageTextRepository'
    },
    {
      key: 'currentTabService',
      implementationClass: ChromeCurrentTabService,
      implementationName: 'ChromeCurrentTabService'
    },
    {
      key: 'chromeRuntimeService',
      implementationClass: ChromeRuntimeService,
      implementationName: 'ChromeRuntimeService'
    },
    {
      key: 'getSelectionService',
      implementationClass: GetSelectionService,
      implementationName: 'GetSelectionService'
    }
  ];

  it('should verify expected services are registered and can be resolved', () => {
    // Arrange
    const expectedRegistrations = expectedServiceRegistrations;

    // Act & Assert - 各サービスが登録されていて解決できることを確認
    expectedRegistrations.forEach(({ key, implementationClass, implementationName }) => {
      // Awilixコンテナに登録されているか確認
      const hasRegistration = container.hasRegistration(key);
      expect(hasRegistration).toBe(true);

      // resolveテスト
      expect(() => {
        const resolved = container.resolve(key) as any;
        expect(resolved).toBeDefined();
        expect(resolved).not.toBeNull();
        expect(typeof resolved).toBe('object');
        expect(resolved.constructor).toBeDefined();
        expect(resolved.constructor.name).toBe(implementationName);
        expect(resolved).toBeInstanceOf(implementationClass);
        console.log(`Service ${key} resolved to ${implementationName} successfully`);
      }).not.toThrow();
    });
  });

  it('should have all expected service registrations', () => {
    // 登録されているキーの数を確認
    const registeredKeys = Object.keys(container.registrations);
    const expectedServiceKeys = expectedServiceRegistrations.map(r => r.key);

    expectedServiceKeys.forEach(key => {
      expect(registeredKeys).toContain(key);
    });
  });
});
