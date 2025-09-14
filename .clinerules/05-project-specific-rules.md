# プロジェクト固有ルール

## プロジェクト概要
- **プロジェクト名**: favorite-keyword-link-frog
- **目的**: ブラウザ拡張機能（WXT フレームワーク使用）
- **アーキテクチャ**: クリーンアーキテクチャ + DDD
- **主要技術**: TypeScript, React, WXT

## リポジトリ固有情報

### リモートリポジトリ
- **GitHub**: `akAredminEogre/favorite-keyword-link-frog`
- **base branch**: `develop`
- **PR作成**: `gh` コマンド使用

### 作業ディレクトリ
- **ホームディレクトリ**: `~/akAredminEogre-project`
- **プロジェクトルート**: `~/akAredminEogre-project/favorite-keyword-link-frog`
- **フロントエンド**: `host-frontend-root/frontend-src-root`

### docsディレクトリ管理
- **進行中**: `docs/issue-XXX/`
- **完了済み**: `docs/completed/issue-XXX/`
- **テンプレート**: `docs/issue-000/`

### 必須除外ファイル
コミット時に以下を除外:
- `WITH_CLINE.md` (作業中の指示改善)
- `issues.md` (タスク管理)

## プロジェクト固有の技術制約

### WXTフレームワーク制約
- `wxt.config.ts`で`srcDir: 'src'`を必ず設定
- エントリーポイントは`src/entrypoints/`に配置
- バックグラウンドスクリプトは`background.ts`
- ポップアップは`popup/`ディレクトリ
- コンテンツスクリプトは`content/`ディレクトリ


### プロジェクト固有コマンド
タスク完了前に下記を実行し、エラーがないことを確認。
未使用コードやエラーが出た場合は、再度修正してから次に進み、改めて実行。
```bash
# プロジェクト固有の未使用コードチェック
cd favorite-keyword-link-frog && \
docker compose exec frontend npm run unused:safe
```

