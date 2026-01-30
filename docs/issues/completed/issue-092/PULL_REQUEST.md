# ISSUE-092 PULL REQUEST

## タイトル
E2Eテストのローカルサーバー設定を修正してコンテナ環境で正しく動作するように改善

## 概要と理由
Dockerコンテナ環境でE2Eテストを実行する際、テスト用のHTTPサーバーがすべてのネットワークインターフェース（0.0.0.0）でリッスンしていたため、ローカライズされた環境やコンテナ環境での接続に問題が発生する可能性がありました。

この問題を解決するため、PlaywrightのwebServer設定を修正し、明示的に127.0.0.1（localhost）でリッスンするように変更しました。

## 主な変更点

### 1. playwright.config.ts の修正
- **ファイル**: `host-frontend-root/frontend-src-root/playwright.config.ts:57`
- **変更内容**: http-serverコマンドに `-a 127.0.0.1` オプションを追加
- **変更前**: `command: 'npx http-server tests/e2e/test-pages -p 8080'`
- **変更後**: `command: 'npx http-server tests/e2e/test-pages -p 8080 -a 127.0.0.1'`
- **理由**: コンテナ環境でのE2Eテスト実行時に、テストサーバーが確実にlocalhostでアクセス可能になるよう明示的にアドレスを指定

### 2. Claude Code設定の改善
- **ファイル**: `.claude/settings.local.json`
- **変更内容**: E2Eテスト関連のBashコマンドを自動承認リストに追加
  - `docker compose exec -T frontend npm run test:e2e`
  - `docker compose exec -T frontend npm run test:e2e -- replace-inside-dom-with-regex.spec.ts`
  - `docker compose exec -T frontend env`
- **理由**: 開発効率向上のため、頻繁に使用するE2Eテストコマンドを事前承認

### 3. ワークフロードキュメントの改善
- **ファイル**: `.clinerules/02-workflow-automation/01-issue-launches/workflow:create-branch.md`
- **変更内容**: ブランチ作成後に `git push origin` する指示を追加
- **理由**: ワークフローの完全性向上

## テスト方法
[動作確認の手順]
- `make test-and-check` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- E2Eテストが正常に実行できることを確認:
  ```bash
  docker compose exec frontend npm run test:e2e
  ```

## 補足
この変更により、Docker環境でのE2Eテストの安定性が向上します。特に、異なるネットワーク設定やセキュリティ制約がある環境での実行において、より予測可能な動作が期待できます。

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
