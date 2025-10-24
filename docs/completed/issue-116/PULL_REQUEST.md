# ISSUE-116 PULL REQUEST

## タイトル
fix: Node.js DEP0066 deprecation warning の解決

## 概要と理由

### 問題
`make e2e` 実行時に以下のNode.js非推奨API警告が表示されていました：

```
[WebServer] (node:11070) [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
```

### 原因
Playwrightの`webServer`設定で使用していた`http-server`パッケージが、依存パッケージ`union`（v0.5.x）経由で非推奨API `OutgoingMessage.prototype._headers` を使用していたため。

具体的には、`http-server` → `union` → `response-stream.js:50`の箇所で非推奨APIが使用されていました。

### 解決策
E2Eテスト用のローカルHTTPサーバーを`http-server`から`serve`パッケージに変更しました。`serve`パッケージ（v14.2.5）はNode.js v20.19.5環境で非推奨APIの警告を出さないことを事前に確認しました。

## 主な変更点

### コード変更
- **`host-frontend-root/frontend-src-root/playwright.config.ts`** (57行目)
  - E2Eテスト用webServerコマンドを変更
  - 変更前: `npx http-server tests/e2e/test-pages -p 8080 -a 127.0.0.1`
  - 変更後: `npx serve tests/e2e/test-pages -l 8080`

### ドキュメント変更
- Issue #116関連ドキュメント（ISSUE.md, PLAN.md, DAILY_SCRUM-01.md, PROGRESS-01-01.md, RETROSPECTIVE.md）の作成・更新

## テスト方法

### 動作確認の手順
1. DEP0066警告が解消されたことの確認
   ```bash
   make e2e
   ```
   - 警告が表示されないことを確認
   - 全12件のE2Eテストが成功することを確認

2. 回帰テスト通過の確認
   ```bash
   make testlint
   ```
   - 単体テスト276件すべて成功
   - E2Eテスト12件すべて成功
   - knipによる未使用コード検出でクリーン

### 検証済み結果
- ✅ DEP0066警告が完全に解消
- ✅ `make testlint` 完全成功
- ✅ E2Eテストの機能に影響なし（全テスト成功）

## 補足

### 調査過程
`node --trace-deprecation`フラグを使用して警告の発生源を特定しました。最初は`http-server`の最新版（v14.1.1）への更新を検討しましたが、依然として古い`union`パッケージを使用していたため、代替パッケージへの移行を選択しました。

### 選定理由
- `serve`パッケージは非推奨API警告を出さない
- 機能的に`http-server`と同等のシンプルな静的ファイルサーバー
- Node.js v20環境でのテストで問題なく動作確認済み

## 本スコープの対象外となったタスク

なし（すべての計画タスクを完了）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
