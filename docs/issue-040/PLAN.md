# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## Story-1: 開発者としてgetElementSelectionロジックをapplication層に移管することにより、Clean Architectureに準拠したコード構造を得る

getElementSelectionロジックが現在content.ts内で直接実装されているため、責務が混在している。
このロジックをapplication層のユースケースクラスに移管し、適切な層分離を実現する。

### タスク

- [x] GetElementSelectionUseCaseクラスの新規作成
- [x] content.tsからgetElementSelectionInfo関数の削除
- [x] content.tsでGetElementSelectionUseCaseを使用するように修正
- [x] ビルドテストの実施
- [x] 動作確認
