# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## Story-1: 開発者としてNodeTextReplacerクラスの条件分岐を削除することにより、コードの保守性を向上させる

NodeTextReplacerクラス内の`replacementValue.isHtml()`による条件分岐が不要であることが判明したため、この分岐を削除し、常に`HtmlReplacer`を使用するように変更する。これにより、コードの複雑性を減らし、保守性を向上させる。

### タスク

- [x] NodeTextReplacerクラスの条件分岐ロジックを削除
- [x] HtmlReplacerの統一的な使用への変更
- [x] 不要なインポートの削除

## Story-2: 開発者として不要になったクラスを削除することにより、コードベースの簡素化を図る

リファクタリングにより不要になったReplacementValueクラスとTextReplacerクラス、およびそれらに関連するテストファイルを削除し、コードベースを整理する。

### タスク

- [x] ReplacementValue.tsの削除
- [x] TextReplacer.tsの削除
- [x] ReplacementValue.test.tsの削除
- [x] TextReplacer.test.tsの削除

## Story-3: 開発者としてテストの実行により、リファクタリングが正常に動作することを確認する

リファクタリング後にユニットテストとe2eテストを実行し、既存機能に影響がないことを確認する。

### タスク

- [x] ユニットテストの実行と確認（99テスト全て通過）
- [x] e2eテストの実行と確認（機能テスト1個通過、ネットワークエラー4個）
- [x] NodeTextReplacer.test.tsの更新
