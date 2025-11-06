# ISSUE-039 applySingleRuleを廃止し、applyAllRulesに統一するリファクタリング

## タイトル
refactor: applySingleRuleを廃止し、applyAllRulesに統一

## 概要と理由
`applySingleRule`と`applyAllRules`の機能が同一であることが確認されたため、重複したロジックを削除し、`applyAllRules`に統一するリファクタリングを実施しました。これにより、コードの複雑性を削減し、保守性を向上させます。

## 主な変更点
- `background.ts`: `applySingleRule`メッセージを`applyAllRules`に変更
- `content.ts`: `applySingleRule`メッセージハンドラーを削除し、コメント番号を整理
- 単一ルール適用と全ルール適用のロジックを`applyAllRules`に統一

## テスト方法
1. 既存の全テストが正常に通過することを確認（65テスト全て成功）
2. ポップアップからのルール適用機能が正常に動作することを手動確認
3. backgroundスクリプトからの自動ルール適用が正常に動作することを確認

## 補足
事前の検証により、`applySingleRule`と`applyAllRules`は同じ`applyAllRules()`メソッドを呼び出していることが判明していました。この統一により、メッセージハンドラーの処理がシンプルになり、今後の機能追加や修正が容易になります。
