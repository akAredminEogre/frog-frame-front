# ISSUE-151 PULL REQUEST

## タイトル
feat: workflow-list-unmerged-branches ワークフローの追加

## 概要と理由
developにマージされていないローカル・リモートブランチを一覧表示するワークフローを追加しました。
このワークフローにより、開発者は現在の未マージブランチの状況を簡単に把握できるようになります。

## 主な変更点
- `.clinerules/02-workflow-automation/01-issue-launches/workflow-list-unmerged-branches.md` の追加
  - developにマージされていないローカルブランチの一覧表示
  - developにマージされていないリモートブランチの一覧表示
- `.claude/commands/workflow-list-unmerged-branches.md` の追加
  - Claude Codeから `/workflow-list-unmerged-branches` コマンドで呼び出し可能

## テスト方法
[動作確認の手順]
- ワークフローの動作確認:

## 補足
- ワークフローは他の既存ワークフローと同じパターンで作成
- Claude Codeのコマンドシステムに統合済み
- ユーザーが簡単にブランチ状況を把握できるユーティリティとして機能

## 本スコープの対象外となったタスク
- makeコマンド化（TODOコメントとして記録済み）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->