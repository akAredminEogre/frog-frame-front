import '../../setup';

import Dexie from 'dexie';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RewriteRuleSchema } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DatabaseMigrationV1 } from 'src/infrastructure/persistence/indexeddb/migrations/DatabaseMigrationV1';
import { DatabaseMigrationV2 } from 'src/infrastructure/persistence/indexeddb/migrations/DatabaseMigrationV2';

/**
 * DatabaseMigrationV1からV2へのマイグレーションテスト
 * 
 * テスト目的:
 * 1. V1スキーマで作成されたデータがV2マイグレーション後も正常に維持される
 * 2. V2マイグレーション時に既存レコードにisActive=trueが自動設定される
 * 3. V1からV2への移行がデータ損失なく完了する
 */
describe('DatabaseMigrationV1ToV2 - 正常系', () => {
  let testDatabase: Dexie;
  let rewriteRulesTable: Dexie.Table<RewriteRuleSchema, number>;

  beforeEach(async () => {
    // IndexedDB環境の検証
    if (!globalThis.indexedDB) {
      throw new Error(
        'IndexedDB is not available in test environment. ' +
        'Please check if fake-indexeddb setup is correct in tests/unit/infrastructure/persistence/indexeddb/setup.ts.'
      );
    }

    // 一意なデータベース名で新しいインスタンスを作成
    const dbName = `TestMigrationDatabase_${Date.now()}_${Math.random()}`;
    testDatabase = new Dexie(dbName);
  });

  afterEach(async () => {
    if (testDatabase && testDatabase.isOpen()) {
      await testDatabase.delete();
    }
  });

  it('should migrate data from V1 to V2 and add isActive=true to existing records', async () => {
    // Step 1: V1スキーマでデータベースを作成し、テストデータを追加
    DatabaseMigrationV1.apply(testDatabase);
    await testDatabase.open();
    
    rewriteRulesTable = testDatabase.table('rewriteRules');

    // V1スキーマでレコードを追加（isActiveフィールドなし）
    const testRecord1Id = await rewriteRulesTable.add({
      oldString: 'test-old-1',
      newString: 'test-new-1',
      urlPattern: 'https://example1.com',
      isRegex: false
    } as any);

    const testRecord2Id = await rewriteRulesTable.add({
      oldString: 'test-old-2',
      newString: 'test-new-2',
      urlPattern: 'https://example2.com',
      isRegex: true
    } as any);

    // データベースを一度閉じる
    await testDatabase.close();

    // Step 2: V2マイグレーションを適用
    DatabaseMigrationV2.apply(testDatabase);
    await testDatabase.open();

    // Step 3: マイグレーション後の検証
    const migratedRecord1 = await rewriteRulesTable.get(testRecord1Id);
    const migratedRecord2 = await rewriteRulesTable.get(testRecord2Id);

    // 既存フィールドが保持されていることを確認
    expect(migratedRecord1).toBeDefined();
    expect(migratedRecord1!.oldString).toBe('test-old-1');
    expect(migratedRecord1!.newString).toBe('test-new-1');
    expect(migratedRecord1!.urlPattern).toBe('https://example1.com');
    expect(migratedRecord1!.isRegex).toBe(false);

    expect(migratedRecord2).toBeDefined();
    expect(migratedRecord2!.oldString).toBe('test-old-2');
    expect(migratedRecord2!.newString).toBe('test-new-2');
    expect(migratedRecord2!.urlPattern).toBe('https://example2.com');
    expect(migratedRecord2!.isRegex).toBe(true);

    // isActiveフィールドがtrueで自動設定されていることを確認
    expect(migratedRecord1!.isActive).toBe(true);
    expect(migratedRecord2!.isActive).toBe(true);
  });

  it('should allow V2 schema operations after migration from V1', async () => {
    // Step 1: V1スキーマでデータベースを初期化
    DatabaseMigrationV1.apply(testDatabase);
    await testDatabase.open();
    
    rewriteRulesTable = testDatabase.table('rewriteRules');
    
    // V1レコードを追加
    await rewriteRulesTable.add({
      oldString: 'legacy-old',
      newString: 'legacy-new',
      urlPattern: 'https://legacy.com',
      isRegex: false
    } as any);

    await testDatabase.close();

    // Step 2: V2マイグレーションを適用
    DatabaseMigrationV2.apply(testDatabase);
    await testDatabase.open();

    // Step 3: V2スキーマでの新規レコード追加が可能であることを確認
    const newRecordId = await rewriteRulesTable.add({
      oldString: 'new-old',
      newString: 'new-new',
      urlPattern: 'https://new.com',
      isRegex: true,
      isActive: false
    });

    // 新規追加されたレコードが正しく保存されていることを確認
    const newRecord = await rewriteRulesTable.get(newRecordId);
    expect(newRecord).toBeDefined();
    expect(newRecord!.oldString).toBe('new-old');
    expect(newRecord!.newString).toBe('new-new');
    expect(newRecord!.urlPattern).toBe('https://new.com');
    expect(newRecord!.isRegex).toBe(true);
    expect(newRecord!.isActive).toBe(false);

    // 全レコード数が2件（マイグレーション後のレガシー + 新規）であることを確認
    const allRecords = await rewriteRulesTable.toArray();
    expect(allRecords).toHaveLength(2);
  });

  it('should handle empty database migration from V1 to V2', async () => {
    // Step 1: V1スキーマで空のデータベースを作成
    DatabaseMigrationV1.apply(testDatabase);
    await testDatabase.open();
    
    rewriteRulesTable = testDatabase.table('rewriteRules');
    
    // 空であることを確認
    const initialCount = await rewriteRulesTable.count();
    expect(initialCount).toBe(0);

    await testDatabase.close();

    // Step 2: V2マイグレーションを適用
    DatabaseMigrationV2.apply(testDatabase);
    await testDatabase.open();

    // Step 3: マイグレーション後も空であることを確認
    const postMigrationCount = await rewriteRulesTable.count();
    expect(postMigrationCount).toBe(0);

    // V2スキーマでの新規レコード追加が可能であることを確認
    const newRecordId = await rewriteRulesTable.add({
      oldString: 'empty-db-test',
      newString: 'empty-db-result',
      urlPattern: 'https://empty.com',
      isRegex: false,
      isActive: true
    });

    const newRecord = await rewriteRulesTable.get(newRecordId);
    expect(newRecord).toBeDefined();
    expect(newRecord!.isActive).toBe(true);
  });
});