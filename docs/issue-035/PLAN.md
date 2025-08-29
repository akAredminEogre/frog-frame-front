# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->



## Story-1: ユーザーとして正規表現でも改行コードを無視した置換により正確な置換を得る

正規表現を使った置換でも、HTMLに含まれる改行コードを無視して置換が実行されるようにする。
ignore-crlf-replace-with-regex.spec.tsのE2Eテストがパスするように実装する。

### タスク

- [x] HtmlContent.tsの正規表現処理部分にcreateRedundantRegexPatternメソッドを追加
- [x] 正規表現パターン内の`<`→`\s*<`、`>`→`>\s*`変換ロジックの実装  
- [x] ignore-crlf-replace-with-regex.spec.tsテストファイルの修正（チェックボックス処理と構文エラー）
- [x] E2Eテストの実行と動作確認
- [x] スクラム記録の作成
