# プロジェクト固有ルール

## プロジェクト概要
- **プロジェクト名**: frog-frame-front
- **目的**: ブラウザ拡張機能（WXT フレームワーク使用）
- **アーキテクチャ**: クリーンアーキテクチャ + DDD
- **主要技術**: TypeScript, React, WXT

## リポジトリ固有情報

### リモートリポジトリ
- **GitHub**: `akAredminEogre/frog-frame-front`
- **base branch**: `develop`
- **PR作成**: `gh` コマンド使用

### docsディレクトリ管理
- **進行中**: `docs/issue-XXX/`
- **完了済み**: `docs/completed/issue-XXX/`
- **テンプレート**: `docs/issue-000/`

### 必須除外ファイル
コミット時に以下を除外:
- `issues.md` (タスク管理)

## プロジェクト固有の技術制約

### WXTフレームワーク制約
- `wxt.config.ts`で`srcDir: 'src'`を必ず設定
- エントリーポイントは`src/entrypoints/`に配置
- バックグラウンドスクリプトは`background.ts`
- ポップアップは`popup/`ディレクトリ
- コンテンツスクリプトは`content/`ディレクトリ


### タスク完了前の必須チェック

詳細はCLAUDE.mdの「Critical Pre-Completion Check」セクションを参照してください。
