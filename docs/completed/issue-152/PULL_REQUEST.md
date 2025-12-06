# ISSUE-152 PULL REQUEST テンプレート

## タイトル
fix: workflow-create-worktree.mdでカレントブランチでworktree作成エラーを解消

## 概要と理由
現在の`workflow-create-worktree.md`を実行すると、カレントブランチではworktreeを作成できないというエラーが発生していました。

**問題の原因:**
- workflow-create-worktree.mdでは新しいブランチを作成してpushした後、そのブランチ上でworktreeを作成しようとしていた
- git worktreeコマンドは現在チェックアウトしているブランチに対してはworktreeを作成できないため、エラーが発生していた

**解決策:**
ブランチをpushした後にdevelopブランチに戻る手順を追加することで、作成したブランチに対してworktreeを安全に作成できるようになりました。

## 主な変更点
- `.clinerules/02-workflow-automation/01-issue-launches/workflow-create-worktree.md`
  - ブランチ作成・push後にdevelopブランチに戻るステップを追加
  - `git checkout develop` コマンドの実行を明示

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 修正後のworkflow-create-worktree.mdが実際に動作することを確認（次回以降のタスク）

## 補足
[追加の文脈や注意点]
- git worktreeの仕組み上、現在チェックアウト中のブランチに対してはworktreeを作成できない制約があることを確認（参照: [Git公式ドキュメント](https://git-scm.com/docs/git-worktree) - "By default, add refuses to create a new worktree when <commit-ish> is a branch name and is already checked out by another worktree"）
- この修正により、ワークフロー実行時のユーザビリティが向上

## 本スコープの対象外となったタスク
- 修正したworkflow-create-worktree.mdの実際の動作テスト
- 類似のワークフロー文書での同様問題の確認

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->