# 受け入れ条件

## ユーザーストーリー要件

- [x] AC-1: すべてのメッセージング通信が @webext-core 経由になっている
- [x] AC-2: Content Script → Background のデータ取得が動作する（proxy-service）
- [x] AC-3: Background → Content Script のコマンド送信が動作する（messaging）

## 技術要件

- [x] AC-4: 型安全性が確保されている（any 型の排除）
- [x] AC-5: レガシーなメッセージングコードが削除されている
  - messageRouter: ✅ 削除済み
  - getAllRewriteRulesHandler: ✅ 削除済み
  - `chrome.runtime.sendMessage` 直接使用: ✅ 削除済み
  - `chrome.tabs.sendMessage` 直接使用: ✅ 削除済み（`sendGetElementSelectionMessage` に置換）
  - ※ handlers ディレクトリは @webext-core/messaging 経由で使用中（レガシーではない）
- [x] AC-6: E2E テストがすべてパスする
- [x] AC-7: make testcheck がパスする（CI で確認）

## 将来対応（PR-4）

- [ ] AC-8: handlers ディレクトリが `frameworks-and-drivers/messaging/` 配下に移管されている
  - `infrastructure/browser/handlers/` → `frameworks-and-drivers/messaging/handlers/`
  - `infrastructure/browser/*/runtime/onMessageReceived.ts` → `frameworks-and-drivers/messaging/`
