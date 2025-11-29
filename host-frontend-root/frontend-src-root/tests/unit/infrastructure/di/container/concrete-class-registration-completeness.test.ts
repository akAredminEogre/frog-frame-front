import { container } from 'src/infrastructure/di/container';

import { describe, expect, it } from 'vitest';

import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';

/**
 * DIコンテナのUseCase登録確認テスト
 * container.tsに登録されているUseCaseを検証する
 */
describe('DI Container - UseCase登録確認テスト', () => {
  const expectedUseCaseRegistrations = [
    {
      key: 'handleContextMenuReplaceDomElement',
      implementationClass: HandleContextMenuReplaceDomElement,
      className: 'HandleContextMenuReplaceDomElement'
    },
    {
      key: 'contextMenuSetupUseCase',
      implementationClass: ContextMenuSetupUseCase,
      className: 'ContextMenuSetupUseCase'
    },
    {
      key: 'dexieRewriteRuleRepository',
      implementationClass: DexieRewriteRuleRepository,
      className: 'DexieRewriteRuleRepository'
    },
    {
      key: 'loadRewriteRuleForEditUseCase',
      implementationClass: LoadRewriteRuleForEditUseCase,
      className: 'LoadRewriteRuleForEditUseCase'
    },
    {
      key: 'updateRewriteRuleUseCase',
      implementationClass: UpdateRewriteRuleUseCase,
      className: 'UpdateRewriteRuleUseCase'
    },
    {
      key: 'closeCurrentWindowUseCase',
      implementationClass: CloseCurrentWindowUseCase,
      className: 'CloseCurrentWindowUseCase'
    },
    {
      key: 'saveRewriteRuleAndApplyToCurrentTabUseCase',
      implementationClass: SaveRewriteRuleAndApplyToCurrentTabUseCase,
      className: 'SaveRewriteRuleAndApplyToCurrentTabUseCase'
    },
    {
      key: 'popupInitFormUseCase',
      implementationClass: PopupInitFormUseCase,
      className: 'PopupInitFormUseCase'
    }
  ];

  it('should verify expected UseCases are registered and can be resolved', () => {
    // Arrange
    const expectedRegistrations = expectedUseCaseRegistrations;

    // Act & Assert - 各UseCaseが登録されていて解決できることを確認
    expectedRegistrations.forEach(({ key, implementationClass, className }) => {
      // Awilixコンテナに登録されているか確認
      const hasRegistration = container.hasRegistration(key);
      expect(hasRegistration).toBe(true);

      // resolveテスト
      expect(() => {
        const resolved = container.resolve(key) as any;
        expect(resolved).toBeDefined();
        expect(resolved).not.toBeNull();
        expect(resolved).toBeInstanceOf(implementationClass);
        console.log(`UseCase ${className} resolved successfully`);
      }).not.toThrow();
    });
  });

  it('should have all expected UseCase registrations', () => {
    // 登録されているキーの数を確認
    const registeredKeys = Object.keys(container.registrations);
    const expectedUseCaseKeys = expectedUseCaseRegistrations.map(r => r.key);

    expectedUseCaseKeys.forEach(key => {
      expect(registeredKeys).toContain(key);
    });
  });
});
