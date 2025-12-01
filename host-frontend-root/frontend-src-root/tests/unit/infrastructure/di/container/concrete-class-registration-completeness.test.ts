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
 * DIコンテナの具体クラス登録確認テスト (Awilix)
 * container.resolve()で具体クラスを解決できることを検証する
 */
describe('DI Container - 具体クラス登録確認テスト (Awilix)', () => {
  it('should resolve HandleContextMenuReplaceDomElement', () => {
    const resolved = container.resolve(HandleContextMenuReplaceDomElement);
    expect(resolved).toBeDefined();
    expect(resolved).not.toBeNull();
    expect(resolved).toBeInstanceOf(HandleContextMenuReplaceDomElement);
  });

  it('should resolve ContextMenuSetupUseCase', () => {
    const resolved = container.resolve(ContextMenuSetupUseCase);
    expect(resolved).toBeDefined();
    expect(resolved).not.toBeNull();
    expect(resolved).toBeInstanceOf(ContextMenuSetupUseCase);
  });

  it('should resolve DexieRewriteRuleRepository', () => {
    const resolved = container.resolve(DexieRewriteRuleRepository);
    expect(resolved).toBeDefined();
    expect(resolved).not.toBeNull();
    expect(resolved).toBeInstanceOf(DexieRewriteRuleRepository);
  });

  it('should resolve LoadRewriteRuleForEditUseCase', () => {
    const resolved = container.resolve(LoadRewriteRuleForEditUseCase);
    expect(resolved).toBeDefined();
    expect(resolved).not.toBeNull();
    expect(resolved).toBeInstanceOf(LoadRewriteRuleForEditUseCase);
  });

  it('should resolve UpdateRewriteRuleUseCase', () => {
    const resolved = container.resolve(UpdateRewriteRuleUseCase);
    expect(resolved).toBeDefined();
    expect(resolved).not.toBeNull();
    expect(resolved).toBeInstanceOf(UpdateRewriteRuleUseCase);
  });

  it('should resolve CloseCurrentWindowUseCase', () => {
    const resolved = container.resolve(CloseCurrentWindowUseCase);
    expect(resolved).toBeDefined();
    expect(resolved).not.toBeNull();
    expect(resolved).toBeInstanceOf(CloseCurrentWindowUseCase);
  });

  it('should resolve SaveRewriteRuleAndApplyToCurrentTabUseCase', () => {
    const resolved = container.resolve(SaveRewriteRuleAndApplyToCurrentTabUseCase);
    expect(resolved).toBeDefined();
    expect(resolved).not.toBeNull();
    expect(resolved).toBeInstanceOf(SaveRewriteRuleAndApplyToCurrentTabUseCase);
  });

  it('should resolve PopupInitFormUseCase', () => {
    const resolved = container.resolve(PopupInitFormUseCase);
    expect(resolved).toBeDefined();
    expect(resolved).not.toBeNull();
    expect(resolved).toBeInstanceOf(PopupInitFormUseCase);
  });
});
