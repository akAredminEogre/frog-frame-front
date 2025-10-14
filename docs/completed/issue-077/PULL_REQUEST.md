# ISSUE-077 PULL REQUEST

## タイトル
RewriteRuleパラメータの型を統一するリファクタリング

## 概要と理由
`SaveRewriteRuleAndApplyToCurrentTabUseCase` において、ローカル定義されていた `RewriteRuleData` インターフェースを削除し、共通型である `RewriteRuleParams` を使用するようにリファクタリングしました。これにより、コードベース全体での型の一貫性が向上し、保守性が改善されます。

また、`RewriteRule` エンティティに `fromParams` ファクトリーメソッドを追加することで、エンティティの生成ロジックをエンティティ自身にカプセル化し、責任の所在を明確にしました。

## 主な変更点

### 1. SaveRewriteRuleAndApplyToCurrentTabUseCase.ts
- ローカル定義の `RewriteRuleData` インターフェースを削除
- 共有型 `RewriteRuleParams` をインポート
- `execute` メソッドのパラメータ型を `RewriteRuleData` から `RewriteRuleParams` に変更
- `saveRule` メソッド内で、`new RewriteRule()` コンストラクタ呼び出しを `RewriteRule.fromParams()` ファクトリーメソッド呼び出しに置き換え

### 2. RewriteRule.ts
- `RewriteRuleParams` 型をインポート
- `fromParams` 静的ファクトリーメソッドを追加
  - `RewriteRuleParams` からRewriteRuleインスタンスを生成
  - エンティティ生成ロジックをエンティティ内にカプセル化

## テスト方法
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足
このリファクタリングは、既存の機能に影響を与えない変更です。型定義を統一し、ファクトリーパターンを導入することで、今後の拡張や保守がより容易になります。

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
