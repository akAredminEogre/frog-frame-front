import Dexie, { Table } from 'dexie';

/**
 * RewriteRuleテーブルのスキーマ型定義
 * IndexedDBに保存するRewriteRuleデータの構造を定義
 *
 * 注意: idはnumber型の自動採番キー
 * ドメインエンティティ(RewriteRule)はstring型のidを使用するため、
 * Repository層で型変換を行う
 */
export interface RewriteRuleSchema {
  id?: number;
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
}

/**
 * Dexie.jsを使用したIndexedDBデータベースクラス
 * Clean Architectureのインフラストラクチャ層に配置
 * RewriteRulesの永続化を提供
 */
class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRuleSchema, number>;

  constructor() {
    super('FrogFrameFrontDatabase');

    // バージョン1: 初期スキーマ定義
    this.version(1).stores({
      // RewriteRulesテーブル
      // - ++id: 自動採番プライマリキー（number型）
      // - urlPattern: インデックス（URL検索の高速化）
      rewriteRules: '++id, urlPattern'
    });
  }
}

/**
 * データベースインスタンスをシングルトンとしてエクスポート
 * アプリケーション全体で単一のデータベース接続を共有
 */
export const dexieDatabase = new DexieDatabase();
