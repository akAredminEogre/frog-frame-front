import '../../../setup';

import Dexie from 'dexie';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DatabaseMigrationV1 } from 'src/infrastructure/persistence/indexeddb/migrations/DatabaseMigrationV1';
import { DatabaseMigrationV2 } from 'src/infrastructure/persistence/indexeddb/migrations/DatabaseMigrationV2';

/**
 * DatabaseMigrationV1からV2へのマイグレーション異常系テスト
 * 
 * テスト目的:
 * 1. 不正な状態でのマイグレーションエラーハンドリング
 * 2. 壊れたデータでのマイグレーション動作確認
 */
describe('DatabaseMigrationV1ToV2 - 異常系', () => {
  let testDatabase: Dexie;

  beforeEach(() => {
    // 一意なデータベース名で新しいインスタンスを作成
    const dbName = `TestMigrationErrorDatabase_${Date.now()}_${Math.random()}`;
    testDatabase = new Dexie(dbName);
  });

  afterEach(async () => {
    if (testDatabase && testDatabase.isOpen()) {
      await testDatabase.delete();
    }
  });

  it('should handle migration when V1 is not applied', async () => {
    // V1マイグレーションを適用せずに直接V2マイグレーションを適用
    // 注意: この場合、Dexieは自動的にV2スキーマで初期化される
    DatabaseMigrationV2.apply(testDatabase);
    
    // データベースが正常に開けることを確認
    await expect(testDatabase.open()).resolves.not.toThrow();
    
    // V2スキーマでの操作が可能であることを確認
    const rewriteRulesTable = testDatabase.table('rewriteRules');
    const newRecordId = await rewriteRulesTable.add({
      oldString: 'direct-v2',
      newString: 'direct-v2-result',
      urlPattern: 'https://direct.com',
      isRegex: false,
      isActive: true
    });

    const newRecord = await rewriteRulesTable.get(newRecordId);
    expect(newRecord).toBeDefined();
    expect(newRecord!.isActive).toBe(true);
  });

  it('should handle multiple migration applications gracefully', async () => {
    // V1マイグレーションを複数回適用
    DatabaseMigrationV1.apply(testDatabase);
    DatabaseMigrationV1.apply(testDatabase); // 重複適用
    
    await testDatabase.open();
    
    const rewriteRulesTable = testDatabase.table('rewriteRules');
    const testRecordId = await rewriteRulesTable.add({
      oldString: 'multiple-v1',
      newString: 'multiple-v1-result',
      urlPattern: 'https://multiple.com',
      isRegex: false
    } as any);

    await testDatabase.close();

    // V2マイグレーションを複数回適用
    DatabaseMigrationV2.apply(testDatabase);
    DatabaseMigrationV2.apply(testDatabase); // 重複適用
    
    await testDatabase.open();

    // データが正常に残っていることを確認
    const migratedRecord = await rewriteRulesTable.get(testRecordId);
    expect(migratedRecord).toBeDefined();
    expect(migratedRecord!.isActive).toBe(true);
  });
});