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

**IMPORTANT: attempt_completionツールを使用する前に、必ず以下のプロジェクト固有チェックを実行すること。**

1. **未使用コードチェックの実行**
   ```bash
   (cd で絶対パスでfrog-frame-frontに移動) && \
   docker compose exec frontend npm run test-and-check
   ```

2. **チェック結果の確認**
   - エラーや未使用コードが検出された場合は、必ず修正してから再度チェックを実行
   - すべてのチェックが正常に完了した場合のみ、attempt_completionツールを使用可能

3. **修正が必要な場合の手順**
   - 検出された問題を修正
   - 再度同じコマンドを実行してチェック
   - エラーがなくなるまで修正とチェックを繰り返す

**このチェックを実行せずにattempt_completionツールを使用することは禁止されています。**
