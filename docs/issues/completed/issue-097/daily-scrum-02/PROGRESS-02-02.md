# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=02
実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
## スクラム-02(02回目) の進捗

PROGRESS-02-01.md のコードレビューフィードバックに対応しました。

### 対応内容

1. **Dexie.jsネイティブな実装への変更**
   - `DexieRewriteRuleRepository`を Dexie.js API を直接使用する実装に変更
   - `create()`: `add()` メソッドを使用（新規作成専用）
   - `update()`: `put()` メソッドを使用（更新専用）
   - `getById()`: `get()` メソッドで IndexedDB に直接クエリ（`getAll()` 経由ではなく）

2. **IRewriteRuleRepository インターフェースの変更**
   - `set(rule: RewriteRule): Promise<void>` を削除
   - `create(rule: RewriteRule): Promise<void>` を追加
   - `update(rule: RewriteRule): Promise<void>` を追加
   - DB 側の ID 自動生成に対応できる設計に変更

3. **DexieDatabase スキーマへのコメント追加**
   - `id` フィールドがプライマリキーであり、自動的にユニーク制約が適用されることを明記

4. **既存コードの更新**
   - `ChromeStorageRewriteRuleRepository` も同様に `set()` を `create()` と `update()` に分割
   - `SaveRewriteRuleAndApplyToCurrentTabUseCase`: `repository.set()` → `repository.create()`
   - `UpdateRewriteRuleUseCase`: `repository.set()` → `repository.update()`

5. **テストの更新**
   - テストディレクトリ構造を `set/` から `create/` と `update/` に分割
   - すべてのテストケースとモックを更新
   - `getById/error-cases.test.ts` に `RewriteRuleNotFoundError` のテストケースを追加

### テスト結果

- ユニットテスト: 281個すべてパス
- E2Eテスト: 9個すべてパス
- knip: 期待通りの警告（DexieDatabase と DexieRewriteRuleRepository は DAILY-SCRUM-04 で使用予定）
- TypeScript コンパイル: エラーなし
- lint: エラーなし

### 修正したファイル

#### 実装コード
- `src/infrastructure/persistance/indexeddb/DexieDatabase.ts`
- `src/application/ports/IRewriteRuleRepository.ts`
- `src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository.ts`
- `src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts`
- `src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase.ts`
- `src/application/usecases/rule/UpdateRewriteRuleUseCase.ts`

#### テストコード
- `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/create/normal-cases.test.ts` (新規)
- `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/update/normal-cases.test.ts` (新規)
- `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/getAll/normal-cases.test.ts`
- `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/getById/normal-cases.test.ts`
- `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/getById/error-cases.test.ts`
- `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/create/normal-cases.test.ts`
- `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/update/normal-cases.test.ts`
- `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getAll/normal-cases.test.ts`
- `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/normal-cases.test.ts`
- `tests/unit/application/usecases/rule/UpdateRewriteRuleUseCase/execute/normal-cases.test.ts`

### 次回以降のスクラムに先送りする課題

なし

### 本issueの対象外とする課題

なし

### スクラム-02(02回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review.md -->
正確に指示せずに申し訳ありません。
PRを細かくする目的で、DexieRewriteRuleRepository は、IRewriteRuleRepository をimplementしない形にしてください。(将来的にはします。)
それであれば、ChromeStorageRewriteRuleRepositoryを修正せずに済み、その影響範囲の変更も一旦は必要なくなり、DexieRewriteRuleRepository特有の実装に集中できると思います。

host-frontend-root/frontend-src-root/src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository.ts
にドメインエンティティのRewriteRuleを参照しているのは、DDDやCleanArchitectureの観点から問題はないでしょうか？
---
