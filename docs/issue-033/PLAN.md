# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## Story-1: 開発者として不要なmatchCountを削除することでコードをシンプルに保つ

HtmlReplacerクラスのreplace()メソッドが返すmatchCountが不要になっているため、戻り値をvoidに変更してコードを簡潔にします。関連するクラスも含めて一貫してリファクタリングを行います。

### タスク

- [x] HtmlReplacer.replace()メソッドの戻り値をvoidに変更
- [x] TextReplacer.replace()メソッドの戻り値をvoidに変更、カウント処理削除
- [x] NodeTextReplacer.replace()メソッドの戻り値をvoidに変更
- [x] HtmlContent.tsのReplaceResult.matchCount削除、処理の簡素化
- [x] 全テストファイルから戻り値関連のアサーション削除
- [x] テスト実行してすべて通過することを確認
