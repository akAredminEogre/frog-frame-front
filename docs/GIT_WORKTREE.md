# Git Worktree Guide

Git worktreeは、同じリポジトリの複数のブランチを同時にチェックアウトできる機能です。これにより、ブランチの切り替えなしで複数の機能を並行開発できます。

## 利点

- **並行開発**: 複数のブランチで同時に作業可能
- **コンテキスト切り替えの削減**: stash/切り替えの手間なし
- **独立した作業環境**: 各worktreeは独立したnode_modules、ビルドキャッシュを持つ
- **コードレビュー効率化**: PRレビュー中も別ブランチで開発継続可能

## ディレクトリ構造

```
frog-frame-front/           # メインワークツリー（developブランチ）
├── worktrees/              # worktreeディレクトリ（.gitignoreで除外）
│   ├── feature-A/          # feature-Aブランチのworktree
│   ├── feature-B/          # feature-Bブランチのworktree
│   └── hotfix-123/         # hotfix-123ブランチのworktree
└── ...
```

## Makeコマンド

### worktree一覧表示

```bash
make wt-list
```

### 新規worktree作成

```bash
# 既存ブランチをworktreeとして追加
make wt-add BRANCH=feature-branch

# 新しいブランチを作成してworktreeとして追加
make wt-add BRANCH=new-feature-branch
```

### worktree削除

```bash
make wt-remove BRANCH=feature-branch
```

### 不要なworktree参照を削除

```bash
make wt-prune
```

## 使用例

### 例1: 新機能開発中にバグ修正

```bash
# メインでfeature-Aを開発中
# 緊急バグ修正のためhotfixブランチを作成
make wt-add BRANCH=hotfix-critical-bug

# hotfixディレクトリで作業
cd worktrees/hotfix-critical-bug
make init-dev  # 初期セットアップ（初回のみ）
# ... バグ修正作業 ...

# 作業完了後、worktreeを削除
cd ../..
make wt-remove BRANCH=hotfix-critical-bug
```

### 例2: 複数機能の並行開発

```bash
# feature-Aのworktreeを作成
make wt-add BRANCH=feature-A

# feature-Bのworktreeを作成
make wt-add BRANCH=feature-B

# 各worktreeで独立して開発
# ターミナル1: cd worktrees/feature-A && make dev
# ターミナル2: cd worktrees/feature-B && make dev
```

## 注意事項

1. **Docker環境**: 各worktreeで`make init-dev`を実行する必要があります（初回のみ）
2. **ポート競合**: 複数のworktreeで同時に`make dev`を実行する場合、ポートが競合する可能性があります。`.env`ファイルでポートを変更してください
3. **ディスク容量**: 各worktreeはnode_modulesを持つため、ディスク容量に注意してください
4. **worktreeディレクトリ**: `worktrees/`ディレクトリは`.gitignore`で除外されています

## 直接gitコマンドを使用する場合

```bash
# worktree一覧
git worktree list

# worktree追加（既存ブランチ）
git worktree add worktrees/branch-name branch-name

# worktree追加（新規ブランチ）
git worktree add -b new-branch worktrees/new-branch

# worktree削除
git worktree remove worktrees/branch-name

# 不要な参照を削除
git worktree prune
```

## トラブルシューティング

### worktreeを追加できない

```
fatal: 'branch-name' is already checked out at '/path/to/repo'
```

同じブランチを複数のworktreeでチェックアウトすることはできません。別のブランチ名を使用してください。

### worktreeを削除できない

```bash
# 強制削除
git worktree remove worktrees/branch-name --force
```

### 古いworktree参照が残っている

```bash
make wt-prune
```
