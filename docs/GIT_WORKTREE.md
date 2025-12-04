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
# 既存ブランチをworktreeとして追加（自動で初期化も実行）
make wt-add BRANCH=feature-branch

# 新しいブランチを作成してworktreeとして追加（自動で初期化も実行）
make wt-add BRANCH=new-feature-branch
```

### worktree初期化

worktreeを作成した後、開発環境の初期化を行います：

```bash
# worktree作成後の初期化（推奨）
make wt-init BRANCH=feature-branch
```

wt-initコマンドは以下の処理を自動実行します：
- 設定ファイル（.env、matchUrl.ts）の自動コピー
- Docker環境の切り替え
- npm install の実行
- WXT準備（npx wxt prepare）の実行

### worktree切り替え

既存のworktreeに切り替えて開発を続ける場合：

```bash
# 別のworktreeに切り替え
make wt-use BRANCH=other-branch
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
# 緊急バグ修正のためhotfixブランチを作成（自動で初期化も実行）
make wt-add BRANCH=hotfix-critical-bug

# hotfixブランチに切り替えて開発開始
make wt-dev BRANCH=hotfix-critical-bug
# ... バグ修正作業 ...

# 元のfeature-Aブランチに戻る
make wt-dev BRANCH=feature-A

# 作業完了後、worktreeを削除
make wt-remove BRANCH=hotfix-critical-bug
```

### 例2: 複数機能の切り替え開発

```bash
# feature-Aのworktreeを作成（自動で初期化も実行）
make wt-add BRANCH=feature-A

# feature-Bのworktreeを作成（自動で初期化も実行）
make wt-add BRANCH=feature-B

# feature-Aで開発開始
make wt-dev BRANCH=feature-A
# ... 機能A開発 ...

# feature-Bに切り替え（自動的にfeature-Aの環境を停止）
make wt-dev BRANCH=feature-B
# ... 機能B開発 ...

# 再度feature-Aに戻る
make wt-dev BRANCH=feature-A
```

### 例3: レビュー中の並行開発

```bash
# 現在PR中のfeature-reviewと新機能feature-nextを並行作業
make wt-add BRANCH=feature-review
make wt-add BRANCH=feature-next

# レビュー対応作業
make wt-dev BRANCH=feature-review
# ... レビュー修正 ...

# 新機能開発に切り替え
make wt-dev BRANCH=feature-next
# ... 新機能開発 ...

# またレビュー対応に戻る
make wt-dev BRANCH=feature-review
```

## 注意事項

1. **Docker環境**: 各worktreeで`make wt-init`を実行してください（初回のみ）
2. **ポート競合**: 現在の実装では同時に開発サーバーを起動できるのは1つのworktreeのみです。別のworktreeで開発する場合は`make wt-use`で切り替えてください
3. **ディスク容量**: 各worktreeはnode_modulesを持つため、ディスク容量に注意してください
4. **worktreeディレクトリ**: `worktrees/`ディレクトリは`.gitignore`で除外されています
5. **自動化された初期化**: `wt-init`コマンドにより設定ファイルコピーやDocker環境切り替えが自動化されています

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
