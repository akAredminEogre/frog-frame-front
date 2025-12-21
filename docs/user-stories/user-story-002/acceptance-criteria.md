# 受け入れ条件

## ユーザーストーリー要件

- [ ] AC-1: すべてのメッセージング通信が @webext-core 経由になっている
- [ ] AC-2: Content Script → Background のデータ取得が動作する
- [ ] AC-3: Background → Content Script のコマンド送信が動作する

## 技術要件

- [ ] AC-4: 型安全性が確保されている（any 型の排除）
- [ ] AC-5: レガシーな messageRouter / handlers が削除されている
- [ ] AC-6: E2E テストがすべてパスする
- [ ] AC-7: make testcheck がパスする
