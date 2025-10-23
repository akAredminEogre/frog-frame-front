# ISSUE-115 PULL REQUEST

## タイトル
RewriteRulesクラスの未使用メソッド削除によるknip警告解消

## 概要と理由

knipによる静的解析で以下の未使用エクスポートメンバーの警告が検出されていました：
```
Unused exported class members (3)
set       RewriteRules  src/domain/value-objects/RewriteRules.ts:35:3
toObject  RewriteRules  src/domain/value-objects/RewriteRules.ts:53:3
getById   RewriteRules  src/domain/value-objects/RewriteRules.ts:63:3
```

プロダクションコード内でRewriteRulesクラスを徹底的に調査した結果、実際に使用されているのは `toArray()` メソッドのみであることが判明しました。未使用メソッドの削除により、コードベースをクリーンに保ち、保守性を向上させます。

## 主な変更点

### プロダクションコード
- **host-frontend-root/frontend-src-root/src/domain/value-objects/RewriteRules.ts**
  - `set()`, `toObject()`, `getById()` メソッドを削除
  - `RewriteRuleNotFoundError` の不要なインポートを削除
  - JSDocコメントを更新（「追加・削除・検索機能」→「配列形式での取得機能」）

### テストコード
- **host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/constructor/normal-cases.test.ts**
  - `toObject()` の使用を `toArray()` に置き換え
  - テストの意図を保ちながら、削除されたメソッドへの依存を除去

- **host-frontend-root/frontend-src-root/tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/update/normal-cases.test.ts**
  - `RewriteRules.getById()` の使用を `repository.getById()` に置き換え（3箇所）
  - Repositoryが提供する適切なメソッドを使用するよう修正

### 削除したファイル/ディレクトリ
- `host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/set/`
- `host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/getById/`

## テスト方法
[動作確認の手順]
- `make testlint` で回帰テスト通過を確認
  - 全ユニットテスト通過（276テスト）
  - 全E2Eテスト通過（12テスト）
  - knip警告が解消されたことを確認
  - lintエラーなし

## 補足
[追加の文脈や注意点]

### 設計判断
- **Repository層の責務**: `getById()` メソッドはDomainオブジェクトではなく、Repository層（`DexieRewriteRuleRepository`）が責任を持つべき機能であることを確認
- **First-Class Collectionパターン**: RewriteRulesクラスは、配列の取得機能（`toArray()`）に特化したシンプルな実装となり、ThoughtWorks Anthologyの原則により適合

### 振り返り（KPT法）
**Keep:**
- プロダクションコード内での使用箇所を徹底的に調査してから削除を実行
- テストコードの修正を慎重に実施
- 削除前後でmake testlintによる包括的な検証を実施

**Problem:**
- 最初のmake testlint実行でDexieRewriteRuleRepositoryのテストが失敗
- テストコードでの依存関係の理解に時間を要した

**Try:**
- メソッド削除前に、使用箇所を一覧化する
- Repositoryパターン使用時、責務分離を意識
- エラーメッセージから影響範囲を事前に予測

## 本スコープの対象外となったタスク

なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
