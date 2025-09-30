# ISSUE 単位
## ISSUE開始時
workflow:create-branch branch-suffix=

- ISSUE.mdの `# 概要` 、 `# 受け入れ条件` 、 `# タスク`(任意) を記載する

## ISSUE 開始時の指示
workflow:create-plan-with-issueに移管

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
PLAN.mdのレビューが完了しました。
まず、下記の内容でコミットしてください。
- 対象：docs/issue-nnn/PLAN.md
- コミットメッセージ
  - docs: issue-nnnのPLAN.mdの作成、レビュー完了
```

# DAILY SCRUM単位
## DAILY SCRUM 開始時の指示
workflow:create-daily-scrumに移管

## DAILY_SCRUM-kk.md作成後の指示
workflow:see-and-commit-review-comment-then-code-againに移管


## DAILY_SCRUM.md実装終了後

### 最初にプラン作成を指示しなかった時
workflow:create-daily-scrum-doc-after-coding

### 振り返り指示
workflow:daily-scrum-pass-review

### コミット指示
workflow:commit-daily-scrum


## PR作成前の確認
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
docs/issue-nnn/ 以下のドキュメント群から変更されたファイルを取得し、それらが、.clinerules に従っていることを確認してください。
合致しない部分には、`TODO:` のコメントを入れてください
```

## PR作成時の指示

### PRテンプレートの作成
favorite-keyword-link-frog/.clinerules/02-workflow-automation/04-pull-request/01-create-pr-md.mdに移管
workflow:create-pr-md

### PR作成
workflow:submit-pull-requestに移管

## PR変更時の指示

workflow:update-pr-mdに移管

workflow:re-submit-pull-requestに移管


## PRクローズ時の指示
workflow:merge-pull-request に移管