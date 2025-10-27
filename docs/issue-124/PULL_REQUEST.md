# ISSUE-124 PULL REQUEST

## タイトル
content.tsのリファクタリング: 関数分割とメッセージルーター導入

## 概要と理由
content.tsはaddListener内でif文が多く、可読性が低く、単一責任の原則に反していたため、background.tsと同様のパターンで関数分割とメッセージルーター導入を実施しました。

## 主な変更点
- `src/entrypoints/content.ts`のリファクタリング
  - chrome.runtime.onMessage.addListenerのロジックを`content.runtime.onMessage.ts`に分割
  - メッセージルーターパターンを導入し、ハンドラーを`content.messageRouter.ts`と`content.messageHandlers.ts`に分割
  - 依存性注入の最適化（リポジトリ生成責任をリスナー層に移動）
- 新規ファイル作成
  - `src/infrastructure/browser/listeners/content.runtime.onMessage.ts`
  - `src/infrastructure/browser/router/content.messageRouter.ts`
  - `src/infrastructure/browser/router/content.messageHandlers.ts`
  - `src/infrastructure/browser/router/handlers/content/applyAllRulesHandler.ts`
  - `src/infrastructure/browser/router/handlers/content/getElementSelectionHandler.ts`
- content関連ファイルの命名規則強化
  - content関連ファイルに`content.`接頭辞を適用してグルーピングを明確化
  - Clean Architectureの技術軸グルーピングとDDD的なコンテキスト境界のバランスを考慮

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 267 unit tests + 12 E2E tests すべて成功
- 未使用コード検出もクリア

## 補足
- background.tsの実装パターンを参考にして一貫性のあるアーキテクチャを実現
- メッセージルーターパターンの導入により拡張性の高い設計に変更
- JSDocによる呼び出し経路のドキュメント化でコードの理解を向上
- 依存性注入の最適化により、content.tsがインフラストラクチャ層から完全に分離

## 本スコープの対象外となったタスク

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->