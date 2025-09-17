# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## 残タスク
- [x] e2eテストに、エラーが発生しないことを確認するassertを追加
- [ ] CurrentTabのコンストラクタをリファクタリング
- [ ] CurrentTabあるいはIDの受け渡しを考慮

### 完了したタスク（Daily Scrum 01）
- Chrome拡張機能のtabs.sendMessageエラーの解決
- 「No matching signature」エラーの修正
- 「Invalid tabId: undefined」エラーの根本原因特定と解決
- Chrome Runtime Message通信でのクラスインスタンスシリアライゼーション問題の解決
- 全テストケースの通過確認

### 完了したタスク（Daily Scrum 02）
- E2Eテストにエラー検知アサートを追加
- 全5つのE2Eテストファイルに汎用的なコンソールエラー監視機能を実装
- 実際のWebページエラーを除外する仕組みを実装（アサート直前にエラー監視開始）
- テストの品質と堅牢性を向上
