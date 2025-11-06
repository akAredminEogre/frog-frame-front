# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## Story-1: 開発者としてクリーンアーキテクチャの原則に従い、コードの保守性と可読性を向上させる

background.tsのストレージ変更処理ロジックをapplication層に移管し、presentation層とbusiness logic層の適切な分離を実現します。

### タスク

- [x] HandleStorageChangedUseCaseクラスを作成
- [x] background.tsからインライン処理を削除し、UseCaseを使用するよう変更
- [x] importの追加とコードリファクタリングの完了
