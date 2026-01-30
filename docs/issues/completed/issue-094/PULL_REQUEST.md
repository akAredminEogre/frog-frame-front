# ISSUE-094 PULL REQUEST

## タイトル
feat: Add Claude Code custom commands for workflow automation

## 概要と理由
このPRでは、Claude Codeのカスタムコマンド機能を実装し、プロジェクトの開発ワークフローを効率化します。`.clinerules/`ディレクトリに定義されている各種ワークフローをClaude Codeのコマンドとして直接実行できるようにすることで、開発プロセスの標準化と自動化を実現します。

## 主な変更点
- `.claude/commands/`ディレクトリに22個のワークフローコマンドファイルを作成
  - 日次スクラム関連コマンド（開始、記録、完了）
  - ブランチ作成とissue管理コマンド
  - プルリクエスト作成・更新・マージコマンド
  - コードレビューとテスト実行コマンド
- 各コマンドファイルは対応する`.clinerules/`のワークフローファイルを参照
- コマンド名はワークフロー内容を明確に示す命名規則を採用

## テスト方法
[動作確認の手順]
- `.claude/commands/`ディレクトリ構造の確認
- 各コマンドファイルが正しい`.clinerules/`ファイルを参照していることの確認
- `make test-and-check` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認

## 補足
- このPRはissue-094の要件に基づいて、Claude Codeのカスタムコマンド機能を活用した開発効率化を実現します
- 各コマンドはプロジェクトの標準開発フローに沿った形で設計されています
- 今後の開発では、これらのコマンドを使用することで一貫性のある開発プロセスが維持されます

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->