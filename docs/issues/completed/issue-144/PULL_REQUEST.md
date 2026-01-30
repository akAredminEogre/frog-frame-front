# ISSUE-144 PULL REQUEST

## タイトル
feat: IndexedDBのRewriteRulesテーブルにisActiveカラムを追加

## 概要と理由
IndexedDBのRewriteRulesテーブルに、`isActive`カラムを追加し、RewriteRuleが有効か無効かを管理できるようにする機能を実装しました。この実装により、将来的にユーザーがリライトルールを一時的に無効化できる基盤が整います。

## 主な変更点

### ドメイン層の変更
- **RewriteRule.ts**: エンティティに`isActive`プロパティを追加（optional、デフォルト値：true）
- **RewriteRuleParams.ts**: コンストラクタパラメータに`isActive`をoptionalとして追加

### インフラストラクチャ層の変更
- **DexieDatabase.ts**: スキーマにisActiveカラムを追加し、バージョン2マイグレーションを実装
- **DexieRewriteRuleRepository.ts**: 全CRUD操作（create/update/getAll/getById）でisActiveカラムの処理を実装
- **DatabaseMigrationV1.ts**: 初期スキーマ定義を独立ファイルに分離（新規作成）
- **DatabaseMigrationV2.ts**: isActiveマイグレーション処理を独立ファイルに分離（新規作成）

### テスト追加・更新
- **ドメインエンティティテスト**: RewriteRuleのisActiveプロパティに対するテストを追加
- **Repositoryテスト**: 全CRUD操作でisActiveカラムの動作を検証するテストを追加・更新
- **マイグレーションテスト**: データベースマイグレーション動作を包括的にテストする新規テストを追加
  - 正常系3テスト（データ保存、自動isActive設定、V2操作確認）
  - 異常系2テスト（エラーハンドリング検証）

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 全266テスト（マイグレーションテスト5個を含む）が正常に動作することを確認済み

## 補足
- Clean Architecture原則を維持し、適切な責務分離を実現
- TypeScriptのoptional parameterを活用した使いやすいAPI設計
- データベースマイグレーション戦略を適切に実装し、データ安全性を確保
- ESLintのimport順序ルールと絶対パス使用ルールに準拠

## 本スコープの対象外となったタスク
- UIやビジネスロジックへの`isActive`カラムの反映（別チケットで対応予定）
- リライトルール一覧画面での有効/無効表示機能
- リライトルール編集画面での有効/無効切り替え機能

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->