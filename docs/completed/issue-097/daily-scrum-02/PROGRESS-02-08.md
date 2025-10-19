# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=02
実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
## スクラム-02(08回目) の進捗

PROGRESS-02-07.md のコードレビューフィードバックに回答しました。

### 対応内容

Primary key管理に関する質問について回答します。

#### レビューコメント

> 最後にprimary keyについて確認させてください。
> 今回IndexedDBを導入することによって、primary keyの管理をDB側に任せることが可能になったと思います。
> 現在の実装では、application層でIDを生成してからDBに保存していますが、DB側で自動採番する形に変更したいです。
> 現状の実装で、それは可能でしょうか。
> またprimary keyの型については、string型とnumber型のどちらが適切でしょうか？

#### 回答

##### 1. 現在の実装状況

**現在の実装:**
- Primary key型: `string` (UUID)
- 生成場所: Application層 (`SaveRewriteRuleAndApplyToCurrentTabUseCase.ts:35`)
  ```typescript
  const rule = RewriteRule.fromParams(crypto.randomUUID(), params);
  ```
- スキーマ定義: `rewriteRules: 'id, urlPattern'` (非自動採番)

##### 2. DB側での自動採番は可能か？

**回答: はい、可能です**

Dexie.jsでは、スキーマ定義で `++` プレフィックスを使用することで自動採番を実現できます:

```javascript
// 現在の定義（非自動採番）
this.version(1).stores({
  rewriteRules: 'id, urlPattern'
});

// 自動採番に変更する場合
this.version(1).stores({
  rewriteRules: '++id, urlPattern'
});
```

**実装方法:**
1. スキーマで `'++id'` を指定
2. Primary key型を `string` から `number` に変更
3. Application層での `crypto.randomUUID()` 呼び出しを削除
4. レコード追加時に `id` フィールドを省略（DBが自動生成）

##### 3. Primary key型: string vs number

**推奨: `number` 型（自動採番を使用する場合）**

**`number` 型の利点:**
- ✅ **パフォーマンス**: 数値キーはインデックス検索が高速
- ✅ **ストレージ効率**: UUIDより容量が小さい（36文字 vs 8バイト）
- ✅ **シンプルさ**: Application層でのID生成が不要
- ✅ **DB最適化**: IndexedDBのネイティブ機能を活用
- ✅ **デバッグ**: 連番IDは追跡・デバッグが容易

**`string` 型（UUID）が必要なケース:**
- ❌ 複数データベース間でグローバル一意性が必要
- ❌ 分散システムでUUIDベースの同期が必要
- ❌ 外部システムがUUID形式を期待

**このプロジェクトでの判断:**

Chrome拡張機能でローカルストレージのみを使用するため、`number` 型の自動採番が適切です。

##### 4. 変更が必要なファイル

自動採番に移行する場合、以下のファイルを修正する必要があります:

1. **DexieDatabase.ts** - スキーマ定義を `'++id, urlPattern'` に変更
2. **RewriteRuleSchema** - `id: string` → `id: number`
3. **RewriteRule** - `id: string` → `id: number`
4. **IRewriteRuleRepository** - 各メソッドの型定義を更新
5. **All UseCases** - `crypto.randomUUID()` の削除
6. **All Repositories** - ID関連の実装を調整
7. **All Tests** - テストデータの型を `string` → `number` に更新

##### 5. 既存データとの互換性

**重要な注意点:**

既存のChromeStorageRewriteRuleRepositoryは `string` 型のIDを使用しているため、移行時には以下の対応が必要です:

**オプション1: 段階的な移行**
- 新規データはIndexedDB（`number`型ID）
- 既存データはChromeStorage（`string`型ID）を維持
- 両方のリポジトリを並行運用

**オプション2: 完全な移行**
- ChromeStorageからIndexedDBへデータマイグレーション
- ID型を `string` から `number` にマッピング
- ChromeStorage実装を廃止

**オプション3: 統一した型を使用**
- 両実装で `number` 型を使用
- ChromeStorage実装も `number` 型に変更

##### 6. 推奨アプローチ

**推奨: 自動採番（`number`型）への移行**

理由:
- データベース主導の設計に合致
- パフォーマンスとストレージ効率が向上
- コードの複雑性が低減（ID生成ロジックが不要）
- IndexedDBの標準的な使用方法

**移行戦略:**

1. DexieRewriteRuleRepositoryを `number` 型で完成させる
2. 必要に応じてデータマイグレーション機能を実装
3. ChromeStorage実装も同じ型に統一（または廃止）

### 修正したファイル

なし（質問への回答のみ）

### 次回以降のスクラムに先送りする課題

なし

### 本issueの対象外とする課題

なし

### スクラム-02(08回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review.md -->
ありがとうございます。primary keyはnumber型を採用しようと思います。
スキーマ定義で'++id'に変更してください。
ただし、完全移行まではRewriteRuleのidプロパティはstring型のままにしておいてください。
DB側でnumber型のidを管理しつつ、ドメインエンティティではstring型のidを使い続ける形にしたいです。
その前提でテストコードも修正をお願いします。
---
