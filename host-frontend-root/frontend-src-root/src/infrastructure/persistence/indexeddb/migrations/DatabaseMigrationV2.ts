import { Dexie } from 'dexie';

/**
 * データベースバージョン2のマイグレーション定義
 * isActiveカラムの追加
 */
export class DatabaseMigrationV2 {
  /**
   * バージョン2のスキーマ定義を適用
   * @param database Dexieデータベースインスタンス
   */
  static apply(database: Dexie): void {
    // バージョン2: isActiveカラム追加
    database.version(2).stores({
      // RewriteRulesテーブル
      // - ++id: 自動採番プライマリキー（number型）
      // - urlPattern: インデックス（URL検索の高速化）
      // - isActive: インデックス（有効/無効検索の高速化）
      rewriteRules: '++id, urlPattern, isActive'
    }).upgrade(trans => {
      // 既存レコードにisActive=trueを設定
      return trans.table('rewriteRules').toCollection().modify((rule: any) => {
        rule.isActive = true;
      });
    });
  }
}