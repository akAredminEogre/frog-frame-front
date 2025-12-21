# ISSUE-287 PULL REQUEST

## タイトル
fix: Background Scriptメッセージハンドラーを整理しE2Eテストを安定化

## 概要と理由
当初は `@webext-core/messaging` への移行を目指していましたが、E2Eテストで DOM 置換が動作しない問題が発生。調査の結果、`@webext-core/messaging` ハンドラーと native Chrome messaging リスナーが競合していることが判明しました。

Popup と Content Script はすべて native `chrome.runtime.sendMessage` を使用しているため、`@webext-core/messaging` ハンドラーを削除し、native Chrome API のみに統一することでE2Eテストの安定化を実現しました。

## 主な変更点

### メッセージハンドラーの整理
- `registerBackgroundMessageHandlers.ts`: `@webext-core/messaging` ハンドラーを削除し、native `chrome.runtime.onMessage.addListener` のみを使用
- `applyAllRules` ハンドラーに `tabId`/`tabUrl` のバリデーションを追加

### ドキュメント・コメントの修正
- `backgroundMessaging.ts`: 未使用の `@webext-core/messaging` export を削除、型定義のみ残す
- `background.ts`: コメントを native Chrome API 使用に修正
- `ChromeRuntimeRewriteRuleRepository.ts`: 成功時の `rules` 存在チェックを追加
- `user-story-001/README.md`: タスク完了状況を実態に合わせて修正

### ユニットテストの更新
- `registerBackgroundMessageHandlers` のテストを native Chrome messaging 形式に更新
- バリデーションエラーのテストケースを3件追加

## テスト方法
- `npm run compile` - TypeScript コンパイル正常
- `npm run test:unit` - 375テスト全て成功
- E2EテストはCI環境で実行

## 補足
- `@webext-core/proxy-service` の統合は別PRで対応予定（追加調査が必要なため保留）
- 既存のPopup/Content Script側のメッセージング実装に変更なし
- native Chrome messaging を使用することで、拡張機能コンテキスト間の互換性を維持
