# 受け入れ条件

## ユーザーストーリー要件

- [x] AC-1: すべてのメッセージング通信が @webext-core 経由になっている
- [x] AC-2: Content Script → Background のデータ取得が動作する（proxy-service）
- [x] AC-3: Background → Content Script のコマンド送信が動作する（messaging）

## 技術要件

- [x] AC-4: 型安全性が確保されている（any 型の排除）
- [ ] AC-5: レガシーな messageRouter / handlers が削除されている
  - messageRouter: ✅ 削除済み
  - getAllRewriteRulesHandler: ✅ 削除済み
  - applyAllRulesHandler: ⚠️ 残存（messaging 経由で使用中、将来リファクタリング）
- [x] AC-6: E2E テストがすべてパスする
- [x] AC-7: make testcheck がパスする（CI で確認）
