import { Dexie } from 'dexie';

/**
 * データベースバージョン1のマイグレーション定義
 * 初期スキーマ定義
 */
export class DatabaseMigrationV1 {
  /**
   * バージョン1のスキーマ定義を適用
   * @param database Dexieデータベースインスタンス
   */
  static apply(database: Dexie): void {
    // バージョン1: 初期スキーマ定義
    database.version(1).stores({
      // RewriteRulesテーブル
      // - ++id: 自動採番プライマリキー（number型）
      // - urlPattern: インデックス（URL検索の高速化）
      rewriteRules: '++id, urlPattern'
    });
  }
}