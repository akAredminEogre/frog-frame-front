# Gitワークフロー

## ブランチ戦略

- **ベースブランチ**: `develop`
- **ブランチ命名規則**: Issueベースのブランチ（例: `issue-086-docs-how-to-set-up`）
- ブランチ作成手順は `.clinerules/02-workflow-automation/01-issue-launches/workflow-create-branch.md` を参照

## ドキュメント構成

```
docs/
├── issue-XXX/              # 対応中のIssueドキュメント
├── completed/issue-XXX/    # 完了したIssueドキュメント
└── issue-000/             # 新規Issue用テンプレート
```

## コミット除外ファイル

- `WITH_CLINE.md` - 作業中の手順書
- `issues.md` - タスク管理ファイル

## プルリクエスト

- `gh` CLIを使ってPRを作成
- `develop` ブランチをベースにPRを作成
- リポジトリ: `akAredminEogre/frog-frame-front`
