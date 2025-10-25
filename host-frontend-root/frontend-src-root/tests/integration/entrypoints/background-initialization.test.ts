import { container } from 'tsyringe';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';

/**
 * Background エントリーポイントの初期化統合テスト
 *
 * 目的:
 * - エントリーポイントからリスナーをimportする際のDI初期化順序を検証
 * - reflect-metadataが正しく初期化され、DIコンテナが機能することを確認
 * - importソート等による初期化順序の問題を早期に検知
 *
 * テスト方針:
 * - リスナーファイルを実際にimportしてDIコンテナの状態を検証
 * - E2Eテストより軽量で高速に実行可能
 */
describe('Background entrypoint - DI initialization integration test', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should initialize DI container correctly when importing listeners from background entrypoint', async () => {
    // Act - リスナーファイルを実際にimport（background.tsと同じフロー）
    // これにより、実際のアプリケーション起動時と同じimport順序でDIコンテナが初期化される
    await import('src/infrastructure/browser/listeners/runtime.onInstalled');
    await import('src/infrastructure/browser/listeners/tabs.onUpdated');
    await import('src/infrastructure/browser/listeners/contextMenus.onClicked');

    // Assert - DIコンテナが正しく機能することを確認
    // reflect-metadataが正しく初期化されていれば、resolveが成功する
    expect(() => {
      const useCase = container.resolve(ContextMenuSetupUseCase);
      expect(useCase).toBeDefined();
      expect(useCase).toBeInstanceOf(ContextMenuSetupUseCase);
    }).not.toThrow();

    expect(() => {
      const useCase = container.resolve(HandleContextMenuReplaceDomElement);
      expect(useCase).toBeDefined();
      expect(useCase).toBeInstanceOf(HandleContextMenuReplaceDomElement);
    }).not.toThrow();
  });

  it('should verify DI container initialization order - container must be imported before decorated classes', async () => {
    // Arrange - DIコンテナの内部状態を確認
    const registryMap = (container as any)._registry._registryMap as Map<any, any>;

    // Act - リスナーファイルをimport
    await import('src/infrastructure/browser/listeners/runtime.onInstalled');

    // Assert - DIコンテナにContextMenuSetupUseCaseが登録されていることを確認
    const isRegistered = (container as any).isRegistered(ContextMenuSetupUseCase);
    expect(isRegistered).toBe(true);

    // Assert - reflect-metadataが正しく機能していることを確認（登録情報が取得できる）
    const registration = registryMap.get(ContextMenuSetupUseCase);
    expect(registration).toBeDefined();
  });
});
