# ISSUE-082 PULL REQUEST

## タイトル
ドキュメント内のプライバシー情報（PC名・絶対パス）を削除

## 概要と理由
ドキュメント内に開発者のPC名（`@MSI`）や絶対パス情報（`/home/akaredmineogre/akAredminEogre-project`）が含まれていることを発見したため、これらの秘匿情報を削除し、汎用的な表記に置換しました。

公開リポジトリでは開発者個人の環境情報を含めるべきではないため、速やかに対応しました。

## 主な変更点

### 削除・置換した秘匿情報
1. **PC名の削除**: `@MSI` の記述を削除
2. **絶対パスの置換**: `/home/akaredmineogre/akAredminEogre-project` を汎用的な表記に変更

### 修正対象ファイル（9ファイル）
- `docs/completed/issue-065/daily-scrum-03/PROGRESS-03-06.md`
- `docs/completed/issue-065/daily-scrum-04/PROGRESS-04-02.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-01.md`
- `docs/completed/issue-009/PULL_REQUEST.md`
- `docs/completed/issue-031/PULL_REQUEST.md`
- `docs/completed/issue-011/PULL_REQUEST.md`
- `docs/completed/issue-011/PLAN.md`
- `docs/completed/issue-008/PLAN.md`
- `docs/completed/issue-027/PULL_REQUEST.md`

### 調査事項
- Git管理されているファイル全体で秘匿情報の残存確認を実施
- `git rm --cached` による削除の影響分析を実施
- Git履歴からの完全削除方法（git filter-repo等）を調査・分析
  - 最終的にユーザー判断により履歴削除は実施せず、ファイル内容の修正のみで対応

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認
- 修正対象の9ファイルで秘匿情報が削除されていることを目視確認

## 補足
- Gitユーザー名 `@akaredmineogre` は公開情報のため、削除対象外
- `.gitignore`で除外されている`node_modules/.cache`内の絶対パスは対象外
- `.git`ディレクトリ内のGitログファイルは編集対象外

## 本スコープの対象外となったタスク
- Git履歴からの秘匿情報の完全削除
  - 調査の結果、個人開発環境であり影響範囲が限定的であるため、ユーザー判断により実施しないことに決定


<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
