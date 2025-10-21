# ISSUE-110 PULL REQUEST

## タイトル
refactor: messageHandler.tsのメッセージハンドラをタイプ別にクラス分割

## 概要と理由
issue-106-feat-switch-to-indexeddbブランチで実装されたmessageHandlers.tsの変更を取り込み、メッセージハンドラをタイプごとに個別のクラスに分割しました。これにより、コードの保守性と可読性が向上しています。

## 主な変更点
- messageHandlers.tsに記載されていたメッセージハンドラを、それぞれの責務に応じた個別クラスに分割
  - ApplyAllRulesHandler: 全ルール適用のハンドラ
  - ApplyRewriteRuleHandler: 個別ルール適用のハンドラ  
  - CheckContentScriptReadyHandler: コンテンツスクリプト準備状態確認のハンドラ
  - PingHandler: Ping応答のハンドラ
- 各ハンドラクラスは明確な責務を持ち、テスト可能な構造に
- messageHandler.tsはルーティングのみを担当するシンプルな構造に変更

## テスト方法
[動作確認の手順]
- `make test-and-check` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 全てのテストが通過していることを確認済み
- TypeScriptのコンパイルエラーがないことを確認済み

## 補足
- issue-106ブランチからの選択的なマージを実施
- messageHandlers.ts関連の変更のみを取り込み、他の変更は除外
- ブランチ操作のワークフロー（workflow-merge-branch-then-mixed-reset）も作成し、今後の作業効率化を図りました

## 本スコープの対象外となったタスク
- indexedDB関連の変更は本issueのスコープ外として除外
- getAllRulesHandlerクラスは不要との判断により作成対象外

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->