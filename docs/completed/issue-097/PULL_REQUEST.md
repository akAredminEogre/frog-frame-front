# ISSUE-097: IndexedDBへの移行（Dexie.js基盤実装）

## タイトル
feat: DexieRewriteRuleRepository実装とIndexedDB基盤構築

## 概要と理由

現在chrome.storage.localを使用しているデータ永続化を、IndexedDBに移行するための基盤を構築しました。

**背景**:
- chrome.storage.localは容量制限があり、将来的なスケーラビリティに課題がある
- IndexedDBに移行することで、より大きなデータ容量と高速なクエリ機能を活用できる
- Dexie.jsをラッパーとして使用することで、型安全でメンテナンス性の高い実装を実現

**このPRのスコープ**:
- Dexie.jsライブラリのインストールとセットアップ
- IndexedDBデータベーススキーマの設計と実装
- DexieRewriteRuleRepositoryの完全な実装とテスト
- Primary Keyの自動採番対応

## 主な変更点

### 1. Dexie.jsのセットアップ（DAILY-SCRUM-01）

**新規追加**:
- `src/infrastructure/persistance/indexeddb/DexieDatabase.ts`
  - Dexie.jsデータベースクラスの実装
  - RewriteRulesテーブルのスキーマ定義（`'++id, urlPattern'`）
  - Primary Keyの自動採番対応（`++id`プレフィックス）
  - バージョン管理戦略の実装（`.version(1)`）

**依存関係の追加**:
- `dexie` - IndexedDBラッパーライブラリ
- `fake-indexeddb` (devDependency) - テスト用IndexedDBモック

### 2. DexieRewriteRuleRepositoryの実装（DAILY-SCRUM-02）

**新規追加**:
- `src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository.ts`
  - 独立したクラスとして実装（将来的に`IRewriteRuleRepository`を実装予定）
  - `create(rule: RewriteRule): Promise<void>` - 新規ルール作成（DB側で自動採番）
  - `update(rule: RewriteRule): Promise<void>` - 既存ルール更新
  - `getAll(): Promise<RewriteRules>` - 全ルール取得（`each()`で最適化）
  - `getById(id: string): Promise<RewriteRule>` - ID指定でルール取得
  - DB層（`number`型ID）とDomain層（`string`型ID）の型変換処理

**テストファイル**:
- `tests/unit/infrastructure/persistance/indexeddb/setup.ts` - fake-indexeddbセットアップ
- `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/`
  - `create/normal-cases.test.ts` - 正常系テスト（3ケース）
  - `create/Abend/error-cases.test.ts` - 異常系テスト（1ケース：既存ID追加エラー）
  - `update/normal-cases.test.ts` - 正常系テスト（3ケース）
  - `getAll/normal-cases.test.ts` - 正常系テスト（1ケース）
  - `getById/normal-cases.test.ts` - 正常系テスト（2ケース）
  - `getById/error-cases.test.ts` - 異常系テスト（3ケース：未存在、非数値ID）

### 3. アーキテクチャ設計のポイント

**Clean ArchitectureとDDDの遵守**:
- Infrastructure層がDomain層のエンティティを返す設計（依存性逆転の原則に準拠）
- Repositoryパターンの責務（ドメインオブジェクトで返す）を遵守
- 永続化メカニズムの詳細をApplication層から完全に隠蔽

**パフォーマンス最適化**:
- `getAll()`メソッドで`toArray()`から`each()`に変更し、中間配列生成を削減
- メモリ効率の向上

**Primary Keyの自動採番**:
- スキーマ定義: `'++id, urlPattern'`
- DB層で`number`型の自動採番ID管理
- Domain層では`string`型IDを維持（過渡期の互換性確保）
- Repository層で型変換を実施

### 4. テスト結果

```
✅ ユニットテスト: 277個すべてパス（新規追加12個含む）
✅ E2Eテスト: 9個すべてパス
✅ TypeScriptコンパイル: エラーなし
✅ ESLint: エラーなし
```

**Knip警告** (想定通り):
- `DexieDatabase.ts`、`DexieRewriteRuleRepository.ts`、`dexie`が未使用として検出
- これらは次のissueでDI統合時に使用される予定

## テスト方法

### 自動テスト
```bash
# 包括的なテストとリント
make test-and-check

# 個別実行
docker compose exec frontend npm run test           # ユニットテストのみ
docker compose exec frontend npm run test:e2e       # E2Eテストのみ
docker compose exec frontend npm run test:all       # 両方
docker compose exec frontend npm run lint           # Lintのみ
```

### 手動確認
1. **DexieDatabaseクラスの動作確認**
   ```typescript
   import { DexieDatabase } from 'src/infrastructure/persistance/indexeddb/DexieDatabase';
   const db = new DexieDatabase();
   // DevToolsのApplicationタブでIndexedDB "FrogFrameFrontDatabase" を確認
   ```

2. **DexieRewriteRuleRepositoryの動作確認**
   - ユニットテストが自動採番、CRUD操作、エラーハンドリングをすべてカバー
   - fake-indexeddbによる完全なIndexedDBエミュレーション

## 補足

### レビューイテレーション（DAILY-SCRUM-02で13回）

主要なフィードバックと対応:
1. **Dexie.jsネイティブな実装への変更**（進捗02）
   - `add()`、`put()`、`get()`など、Dexie.js APIを直接使用する実装に変更

2. **独立したクラスとしての実装**（進捗03-05）
   - 既存のChromeStorageRewriteRuleRepositoryへの影響を最小化するため
   - IRewriteRuleRepositoryの実装は次のissueで対応

3. **パフォーマンス最適化**（進捗06）
   - `getAll()`で`toArray()`から`each()`への変更

4. **Primary Keyの自動採番対応**（進捗08-10）
   - スキーマ定義を`'++id'`に変更
   - DB層とDomain層の型変換処理を実装

5. **テストコードのリファクタリング**（進捗10-11）
   - 不要な`toObject()`使用を`toArray()`や`getById()`に置き換え

6. **Dexie.jsマイグレーション機能の調査**（進捗12）
   - バージョニングと`.upgrade()`メソッドの使用方法を文書化

7. **異常系テストの追加**（進捗13）
   - 既存IDでの追加試行時のエラー検証テスト

### 設計上の重要な決定事項

**Clean ArchitectureとDDDの観点**（進捗07で議論）:
- Infrastructure層がDomain層のエンティティを返すことは適切
  - 内側への依存であり、Clean Architectureのルールに準拠
  - Repositoryパターンの責務（ドメインオブジェクトの復元）に合致
  - 永続化メカニズムの実装詳細をApplication層から隠蔽

**Primary Key型の選択**（進捗08で議論）:
- `number`型の自動採番を採用
  - パフォーマンス: 数値キーはインデックス検索が高速
  - ストレージ効率: UUIDより容量が小さい
  - シンプルさ: Application層でのID生成が不要

### Dexie.jsマイグレーション機能

将来のスキーマ変更に備えて、Dexie.jsのマイグレーション方法を調査・文書化:
- バージョン管理: `.version(n)`
- データ移行: `.upgrade()`メソッド
- Dexie 3.0以降は、データ移行不要な場合は古いバージョン定義を削除可能

## 本スコープの対象外となったタスク

以下のタスクは別issueに切り出されました:

### 1. DI統合とRewriteRuleRepositoryの切り替え（DAILY-SCRUM-04相当）
- DIコンテナ（`src/infrastructure/di/container.ts`）の更新
- `IRewriteRuleRepository`の登録を`DexieRewriteRuleRepository`に変更
- DexieRewriteRuleRepositoryが`IRewriteRuleRepository`を実装するように修正
  - `create()`/`update()`を`set()`に統合、または`set()`実装で内部振り分け

### 2. 統合テストと最終検証（DAILY-SCRUM-05相当）
- 開発環境での動作確認
  - Rules画面でのルール作成・編集・削除
  - コンテキストメニューからのDOM置換
  - IndexedDBへのデータ保存確認（DevTools）
- 包括的な統合テスト

### 3. その他の対象外項目
- **DexieSelectedPageTextService実装**: SelectedPageTextはchrome.storageに保存する方針に変更したため不要
- **データマイグレーション機能**: アプリ未リリースのため不要
- **既存のIRewriteRuleRepositoryインターフェース変更**: 影響範囲を限定するため、次のissueで対応

### 理由
- PRを小さく保ち、レビューしやすくするため
- DexieRewriteRuleRepositoryの実装とテストに焦点を当て、品質を確保するため
- DI統合は別の関心事として分離し、段階的な移行を可能にするため

## 関連リンク
- [Dexie.js公式ドキュメント](https://dexie.org/)
- [Dexie.js - Database Versioning](https://dexie.org/docs/Dexie/Dexie.version())
- [Dexie.js - Version.upgrade()](https://dexie.org/docs/Version/Version.upgrade())

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
