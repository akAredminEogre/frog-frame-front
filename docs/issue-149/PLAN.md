# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [ ] Docker Override機能の実装準備
  - docker-compose.override.ymlの仕組みを確認
  - .gitignoreへのoverride.yml追加
  - 現在のworktree検出ロジックの設計
- [ ] worktree切り替えコマンドの実装
  - `make wt-use`コマンドの作成
  - docker-compose.override.yml自動生成機能の実装
  - 現在のworktreeディレクトリ検出機能の実装
- [ ] worktree初期化の改善
  - `make wt-init`コマンドの作成（worktree用のinit-dev）
  - 各worktreeでの初回セットアップ自動化
  - メインリポジトリとの設定同期方法の確立
- [ ] テストとドキュメント作成
  - 新しいworktree運用フローのテスト
  - GIT_WORKTREE.mdの更新
  - CLAUDE.mdへの運用手順追加

# ISSUEを通した相談事

現在の構成では、各worktreeで独立したDockerコンテナを起動する必要があり、ポート競合の問題があります。理想的なソリューションとして以下の2つのアプローチを検討しています：

1. **シンボリックリンク活用案**：メインのDockerコンテナは1つだけ起動し、host-frontend-root/frontend-src-rootを現在アクティブなworktreeへのシンボリックリンクとして管理する方法。切り替え時はリンクを更新するだけ。

2. **動的ボリュームマウント案**：環境変数でWORKTREE_PATHを動的に設定し、docker-compose.ymlでそのパスをマウントする方法。worktree切り替え時は環境変数を変更してコンテナを再起動。

どちらのアプローチが良いか、または他により良い方法があるか、ご意見をお聞かせください。

## 返信1
上記2つの案で、worktree切り替え時に必要な作業、実行コマンドを具体的に示してもらえますか？また、各案のメリット・デメリットも教えてください。

### 回答1

#### 1. シンボリックリンク活用案

**実装内容：**
- `host-frontend-root/frontend-src-root` を削除し、シンボリックリンクとして作成
- 各worktreeには実体の `host-frontend-root/frontend-src-root` が存在
- メインのDockerコンテナは1つだけ起動

**切り替え時の実行コマンド：**
```bash
# 新しいworktree切り替えコマンド（Makefileに追加）
make wt-switch BRANCH=feature-A

# 内部的に実行される処理
cd /path/to/main/repo
rm -f host-frontend-root/frontend-src-root
ln -s $(pwd)/worktrees/feature-A/host-frontend-root/frontend-src-root host-frontend-root/frontend-src-root
# WXTのホットリロードをトリガー（必要に応じて）
docker compose exec frontend touch /opt/frontend-container-app-root/frontend-src-root/src/entrypoints/content.ts
```

**メリット：**
- Dockerコンテナの再起動不要（高速切り替え）
- リソース効率的（コンテナは1つのみ）
- ポート競合なし
- node_modulesの共有も可能

**デメリット：**
- ファイルシステムの変更がWXTのwatcherに検知されない可能性
- シンボリックリンクのサポートがOSに依存（Windows環境で制限あり）
- 切り替え時に一時的にファイルアクセスエラーの可能性

#### 2. 動的ボリュームマウント案

**実装内容：**
- `.env` ファイルに `WORKTREE_PATH` 変数を追加
- `docker-compose.yml` でこの変数を使用してボリュームマウント

**docker-compose.yml の変更：**
```yaml
volumes:
  - ${WORKTREE_PATH:-./host-frontend-root}:${CONTAINER_APP_ROOT}/
```

**切り替え時の実行コマンド：**
```bash
# 新しいworktree切り替えコマンド（Makefileに追加）
make wt-switch BRANCH=feature-A

# 内部的に実行される処理
sed -i 's|WORKTREE_PATH=.*|WORKTREE_PATH=./worktrees/feature-A/host-frontend-root|' .env
docker compose down
docker compose up -d
docker compose exec frontend npm run dev
```

**メリット：**
- 確実な切り替え（Dockerが正式にサポート）
- OS非依存
- ファイルシステムの整合性が保証される
- 既存の仕組みの延長で理解しやすい

**デメリット：**
- コンテナの再起動が必要（切り替えに時間がかかる）
- 開発サーバーも再起動が必要
- 切り替え中はサービスが一時停止

#### 推奨案

**第3の案：ハイブリッドアプローチ**

両案の良い点を組み合わせた方法を提案します：

1. **Docker Bindマウントの動的切り替え**
   - Dockerコンテナは起動したまま
   - `docker compose` のoverride機能を使用
   - worktreeごとに `docker-compose.worktree.yml` を生成

**実装例：**
```bash
# worktree切り替えコマンド
make wt-use BRANCH=feature-A

# 内部処理
cat > docker-compose.override.yml <<EOF
services:
  frontend:
    volumes:
      - ./worktrees/feature-A/host-frontend-root:${CONTAINER_APP_ROOT}/
EOF
docker compose up -d  # 変更を適用（コンテナは再作成されるが高速）
```

このアプローチなら：
- 比較的高速な切り替え
- Dockerの正式な機能を使用
- ファイルの整合性も保証

→ OKです。**第3の案：ハイブリッドアプローチ**で進めてください。

# 残タスク
<!-- issueの進捗に応じて記入 -->

# 本issueの対象外とする課題
<!-- issueの進捗に応じて記入 -->