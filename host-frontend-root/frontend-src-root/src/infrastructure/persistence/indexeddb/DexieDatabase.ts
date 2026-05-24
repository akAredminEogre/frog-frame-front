import Dexie, { Table } from 'dexie';

import { DatabaseMigrationV1 } from 'src/infrastructure/persistence/indexeddb/migrations/DatabaseMigrationV1';
import { DatabaseMigrationV2 } from 'src/infrastructure/persistence/indexeddb/migrations/DatabaseMigrationV2';

/**
 * RewriteRuleテーブルのスキーマ型定義
 * IndexedDBに保存するRewriteRuleデータの構造を定義
 *
 * 注意: idはnumber型の自動採番キー
 * ドメインエンティティ(RewriteRule)はnumber型のidを使用
 */
export interface RewriteRuleSchema {
  id?: number;
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  isActive: boolean;
}

/**
 * Dexie.jsを使用したIndexedDBデータベースクラス
 * Clean Architectureのインフラストラクチャ層に配置
 * RewriteRulesの永続化を提供
 * 
 * マイグレーション管理:
 * - 各バージョンのマイグレーションは独立したファイルで管理
 * - DatabaseMigrationVxクラスで各バージョンの変更を定義
 */
class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRuleSchema, number>;

  constructor() {
    super('FrogFrameFrontDatabase');

    // バージョンごとのマイグレーションを適用
    DatabaseMigrationV1.apply(this);
    DatabaseMigrationV2.apply(this);
  }
}

/**
 * データベースインスタンスをシングルトンとしてエクスポート
 * アプリケーション全体で単一のデータベース接続を共有
 */
export const dexieDatabase = new DexieDatabase();
