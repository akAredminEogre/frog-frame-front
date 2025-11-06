# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## 残タスク
- [x] e2eテストに、エラーが発生しないことを確認するassertを追加
- [x] CurrentTabのコンストラクタをリファクタリング
- [x] CurrentTabあるいはIDの受け渡しを考慮

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

### 完了したタスク（Daily Scrum 03）
- CurrentTabで行っているバリデーションをTabIdに移行
- 更新されたテストコーディング規約に従ってテストコードを整理
- TabId以外でTabIdのバリデーション詳細をテストしている重複コードの廃止
- バリデーション責務の適切な分離を実現

### 完了したタスク（Daily Scrum 04）
- Infrastructure層からDomain層へのバリデーション責務の移譲
- ChromeCurrentTabServiceとChromeTabsServiceでのバリデーション処理をDomain層に委譲
- content.tsへのメッセージ送信でプリミティブ型を使用するよう改善
- メッセージ送信時のシリアライゼーション問題の解決
- アーキテクチャの整理と責務分離の改善
