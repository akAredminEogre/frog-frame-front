# ADR-006: DexieによるIndexedDB管理

**ステータス:** 採用  
**日付:** 2024-10-15  
**決定者:** 開発チーム

## コンテキスト

Chrome拡張機能において、書き換えルール等のデータを永続化する必要があった。以下の要件を満たすストレージソリューションが必要:

1. **大容量データ**: 多数の書き換えルールの保存
2. **構造化データ**: リレーショナルなデータモデルのサポート
3. **非同期処理**: Promise/async-awaitベースのAPI
4. **インデックス**: 高速な検索・フィルタリング
5. **Chrome拡張制約**: Service Worker環境での永続化

## 検討した選択肢

### 選択肢1: chrome.storage.local

**メリット:**
- Chrome Extension標準API
- シンプルな key-value ストレージ
- 同期API（chrome.storage.sync）も利用可能
- 追加ライブラリ不要

**デメリット:**
- **容量制限**: 10MBまで（local）、100KBまで（sync）
- インデックスなし（全件取得後のフィルタリングが必要）
- トランザクション非対応
- 複雑なクエリ不可

### 選択肢2: ネイティブIndexedDB

```typescript
const request = indexedDB.open('database', 1);
request.onsuccess = (event) => {
  const db = event.target.result;
  const transaction = db.transaction(['rules'], 'readwrite');
  const objectStore = transaction.objectStore('rules');
  objectStore.add(rule);
};
```

**メリット:**
- ブラウザ標準API
- 大容量データ対応（実質無制限）
- インデックス・トランザクション対応
- 外部ライブラリ不要

**デメリット:**
- **APIが煩雑**: コールバックベースで複雑
- エラーハンドリングが困難
- マイグレーション管理が手動
- TypeScript型定義が弱い

### 選択肢3: Dexie（採用）

```typescript
class MyDatabase extends Dexie {
  rules!: Table<RewriteRule>;
  
  constructor() {
    super('MyDatabase');
    this.version(1).stores({
      rules: '++id, name, url'
    });
  }
}
```

**メリット:**
- **簡潔なAPI**: Promiseベースの直感的なAPI
- **TypeScript対応**: 完全な型安全性
- **マイグレーション管理**: バージョン管理機能内蔵
- **高度なクエリ**: whereClause、フィルタリング、ソート
- **エラーハンドリング**: 統一的なエラー処理
- **軽量**: 約25KBのバンドルサイズ

**デメリット:**
- 外部ライブラリ依存
- 学習コスト（Dexie固有のAPI）
- IndexedDBの全機能は利用不可

## 決定

**Dexieを採用する。**

理由:
1. **開発効率**: 簡潔なAPIによる実装速度の向上
2. **保守性**: マイグレーション機能による スキーマ変更対応
3. **型安全性**: TypeScriptとの優れた統合
4. **Chrome拡張に最適**: Service Worker環境で安定動作
5. **実績**: 多数のプロダクションでの採用実績

## 実装詳細

### データベース定義

```typescript
// infrastructure/persistance/indexeddb/DexieDatabase.ts
export class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRule>;
  
  constructor() {
    super('FrogFrameDB');
    
    // スキーマ定義
    this.version(1).stores({
      rewriteRules: '++id, name, url, createdAt'
    });
    
    // マッピング
    this.rewriteRules.mapToClass(RewriteRule);
  }
}
```

### リポジトリ実装

```typescript
// infrastructure/persistance/indexeddb/DexieRewriteRuleRepository.ts
@injectable()
export class DexieRewriteRuleRepository implements IRewriteRuleRepository {
  constructor(private db: DexieDatabase) {}
  
  async save(rule: RewriteRule): Promise<void> {
    await this.db.rewriteRules.add(rule);
  }
  
  async findAll(): Promise<RewriteRule[]> {
    return await this.db.rewriteRules.toArray();
  }
}
```

## 影響

**ポジティブ:**
- CRUD操作の簡潔な実装
- 複雑なクエリの容易な実装
- データマイグレーションの自動化
- 優れたデバッグ体験（Dexie.debug）

**ネガティブ:**
- バンドルサイズ増加（約25KB）
- Dexie固有のAPIへのロックイン
- IndexedDBの低レベル操作不可

**リスク:**
- Dexieプロジェクトの保守停止
- パフォーマンス問題（大量データ時）
- ブラウザのIndexedDB実装差異

## パフォーマンス考慮事項

- インデックス設計の最適化
- バルク操作（bulkAdd、bulkPut）の活用
- where句による効率的なフィルタリング
- 不要なawaitの削除（並列処理の活用）

## 移行戦略

将来的にIndexedDBから移行する場合:
1. IRewriteRuleRepositoryインターフェースは維持
2. DexieRewriteRuleRepositoryのみを置き換え
3. データエクスポート・インポート機能の実装

## 関連ドキュメント

- `src/infrastructure/persistance/indexeddb/` - Dexie実装
- `docs/design/08-constraints-matrix.md` - ストレージ戦略
- [Dexie公式ドキュメント](https://dexie.org/)