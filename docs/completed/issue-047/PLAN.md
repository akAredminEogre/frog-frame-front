# issue-047実装計画: App.tsxのDI改善

## 概要

## 現状分析

### 課題

## 実装計画

### Step 3: テストコード整備 ★完了
- infrastructure層のテストコード作成（ISSUE.mdのタスクより）
- Application層のテストコード作成
- モックを使用したテスト

**実施内容**: DAILY_SCRUM-01で変更されたinfrastructure層クラスのテストコード作成を完了

## 技術的考慮事項

## 受け入れ条件の確認方法

- [x] `docker compose exec frontend npm run unused:safe`が成功すること
- [x] 既存機能が正常に動作すること
- [x] 新しいテストがすべてパスすること

## 完了基準
- [x] infrastructure層のテストコード作成
- [x] 既存機能の完全な動作確認

## 別issue扱いとなった項目

DAILY_SCRUM-02において、以下の項目は本issue-047の範囲外とし、別issueで扱うことが決定されました：

1. **DIコンテナの拡張**: `container.ts`への`SaveRewriteRuleAndApplyToCurrentTabUseCase`登録
2. **App.tsxのDIリファクタリング**: 手動DIからDIコンテナ使用への変更  
3. **DIコンテナのファクトリメソッド設計**: シンプルなgetterメソッド方式 vs 汎用的なresolve方式の選択
4. **モックライブラリの導入**: Chrome Extension APIのモック化における既存ライブラリ vs 手動モック実装の選択

これらの項目については、より詳細な設計検討とプロトタイプ実装が必要なため、専用のissueで取り扱います。
