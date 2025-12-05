# Git Worktree Guide

Git worktreeは、同じリポジトリの複数のブランチを同時にチェックアウトできる機能です。これにより、ブランチの切り替えなしで複数の機能を並行開発できます。

## シェル関数の設定（推奨）

便利なworktree移動コマンドを使用するため、以下をシェル設定ファイルに追加してください：

```bash
# ~/.bashrcまたは~/.zshrcに追加
source /path/to/frog-frame-front/scripts/wt-cd.sh
```

これにより以下のコマンドが使用可能になります：
- `wt-cd-current` - 現在のworktreeディレクトリに移動
- `wtcd` - 上記のエイリアス（短縮形）

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

### 基本コマンド

#### worktree一覧表示

```bash
make wt-list
```

#### 新規worktree作成

```bash
# 既存ブランチをworktreeとして追加（自動で初期化も実行）
make wt-add BRANCH=feature-branch

# 新しいブランチを作成してworktreeとして追加（自動で初期化も実行）
make wt-add BRANCH=new-feature-branch
```

`wt-add`コマンドは以下の処理を自動実行します：
- worktreeディレクトリの作成
- ブランチの作成/チェックアウト
- **自動初期化**: 設定ファイル（.env、matchUrl.ts）の自動コピー
- **自動初期化**: Docker環境の切り替え
- **自動初期化**: npm install の実行
- **自動初期化**: WXT準備（npx wxt prepare）の実行

#### worktree削除

```bash
make wt-remove BRANCH=feature-branch
```

#### 不要なworktree参照を削除

```bash
make wt-prune
```

### 開発コマンド

#### worktreeで開発サーバー起動

```bash
# worktreeの開発サーバーを起動（自動的に他のコンテナを停止）
make wt-dev BRANCH=feature-branch

# 別のworktreeに切り替え
make wt-dev BRANCH=other-branch
```

`wt-dev`コマンドは以下を自動実行します：
- 他のworktreeのDockerコンテナを自動停止
- ポート3000の競合回避
- 指定されたworktreeディレクトリで独立した開発環境を起動

#### Dockerコンテナ管理

```bash
# worktreeのDockerコンテナを停止
make wt-down

# worktreeのDockerコンテナを起動
make wt-up
```

注：これらのコマンドは`.env.worktree`の設定を使用します。

### ナビゲーションコマンド

#### 現在のworktree確認

```bash
# 現在アクティブなworktreeを表示
make wt-current
```

#### worktreeディレクトリへ移動

```bash
# 現在アクティブなworktreeディレクトリへ移動（sourceコマンドで実行）
source <(make wt-cd-current)

# シェル関数を設定済みの場合
wt-cd-current  # または短縮形: wtcd
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

1. **自動初期化**: `wt-add`実行時に自動的に初期化されるため、手動での初期化は不要です
2. **推奨コマンド**: 切り替えには`make wt-dev`を使用してください（自動でポート競合を回避）
3. **ディスク容量**: 各worktreeはnode_modulesを持つため、ディスク容量に注意してください
4. **worktreeディレクトリ**: `worktrees/`ディレクトリは`.gitignore`で除外されています
5. **自動化された切り替え**: `wt-dev`コマンドにより他のコンテナ停止・環境切り替え・開発サーバー起動が自動化されています
6. **内部ヘルパー関数**: `_`で始まるコマンド（例：`_wt-init`）は内部使用のみで、直接実行する必要はありません

## 簡単ワークフロー（まとめ）

**初回セットアップ（1回のみ）**：
```bash
make wt-add BRANCH=your-branch
# これだけで、worktree作成・ブランチ設定・環境初期化が全て完了
```

**worktree切り替え（日常使用）**：
```bash
make wt-dev BRANCH=your-branch
# これだけで他のworktreeを停止して、指定したworktreeの開発サーバーが起動
```

**不要になったらクリーンアップ**：
```bash
make wt-remove BRANCH=your-branch
```

## コマンドリファレンス

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `wt-list` | すべてのworktreeを一覧表示 | `make wt-list` |
| `wt-add` | 新しいworktreeを作成（自動初期化） | `make wt-add BRANCH=feature-x` |
| `wt-remove` | worktreeを削除 | `make wt-remove BRANCH=feature-x` |
| `wt-prune` | 不要なworktree参照を削除 | `make wt-prune` |
| `wt-current` | 現在アクティブなworktreeを表示 | `make wt-current` |
| `wt-cd-current` | worktreeディレクトリへ移動 | `source <(make wt-cd-current)` |
| `wt-dev` | worktreeで開発サーバーを起動 | `make wt-dev BRANCH=feature-x` |
| `wt-down` | worktreeのDockerコンテナを停止 | `make wt-down` |
| `wt-up` | worktreeのDockerコンテナを起動 | `make wt-up` |

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
