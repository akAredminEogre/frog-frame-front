import '../setup';

import { IDBFactory } from 'fake-indexeddb';
import { describe, expect,it } from 'vitest';

import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';

/**
 * IndexedDB環境検証テスト
 *
 * 目的:
 * - テスト環境でIndexedDBが正しくセットアップされていることを検証
 * - 環境セットアップの問題を早期に検知
 * - ブランチpull後のE2E失敗前にユニットテストレベルで問題を発見
 *
 * 検証内容:
 * 1. globalThis.indexedDBが存在すること
 * 2. fake-indexeddbのIDBFactoryインスタンスであること
 * 3. Dexieデータベースが正常に初期化できること
 */
describe('IndexedDB Environment Verification', () => {
  it('should have indexedDB available in global scope', () => {
    // Assert
    expect(globalThis.indexedDB).toBeDefined();
    expect(globalThis.indexedDB).not.toBeNull();
  });

  it('should be using fake-indexeddb IDBFactory', () => {
    // Assert - fake-indexeddbのIDBFactoryインスタンスであることを確認
    expect(globalThis.indexedDB).toBeInstanceOf(IDBFactory);
  });

  it('should be able to initialize Dexie database', async () => {
    // Act - データベースを開く（Dexieは遅延初期化）
    await dexieDatabase.open();

    // Assert - Dexieデータベースが正常に初期化されることを確認
    expect(dexieDatabase).toBeDefined();
    expect(dexieDatabase.name).toBe('FrogFrameFrontDatabase');
    expect(dexieDatabase.isOpen()).toBe(true);
  });

  it('should have rewriteRules table available', async () => {
    // Assert - rewriteRulesテーブルが存在することを確認
    expect(dexieDatabase.rewriteRules).toBeDefined();

    // テーブルに対する基本操作が可能であることを確認
    await dexieDatabase.rewriteRules.clear();
    const count = await dexieDatabase.rewriteRules.count();
    expect(count).toBe(0);
  });

  it('should be able to perform basic IndexedDB operations', async () => {
    // Arrange
    await dexieDatabase.rewriteRules.clear();

    // Act - 基本的なCRUD操作が可能であることを確認
    const testId = await dexieDatabase.rewriteRules.add({
      oldString: 'test',
      newString: 'test',
      urlPattern: '',
      isRegex: false
    });

    // Assert
    expect(testId).toBeGreaterThan(0);

    const record = await dexieDatabase.rewriteRules.get(testId);
    expect(record).toBeDefined();
    expect(record?.oldString).toBe('test');

    // Cleanup
    await dexieDatabase.rewriteRules.clear();
  });
});
