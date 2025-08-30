# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->



## Story-1: ユーザーとして正規表現でも改行コードを無視した置換により正確な置換を得る

正規表現を使った置換でも、HTMLに含まれる改行コードを無視して置換が実行されるようにする。
ignore-crlf-replace-with-regex.spec.tsのE2Eテストがパスするように実装する。

### タスク

- [x] HtmlContent.tsの正規表現処理部分にcreateRedundantRegexPatternメソッドを追加
- [x] 正規表現パターン内の`<`→`\\s*<`、`>`→`>\\s*`変換ロジックの実装  
- [x] ignore-crlf-replace-with-regex.spec.tsテストファイルの修正（チェックボックス処理と構文エラー）
- [x] E2Eテストの実行と動作確認
- [x] スクラム記録の作成

## Story-2: コード品質向上のためのリファクタリング（スクラム02で実施）

無限ループ防止ロジックの必要性検証と、重複したメソッドの統合によるDRY原則に基づくリファクタリング。

### タスク

- [x] 正規表現による置換処理での無限ループ防止ロジックの必要性検証
- [x] createRedundantRegexPatternとcreateRedundantPatternメソッドの統合
- [x] 統合されたcreateRedundantPattern(pattern: string, isRegex: boolean)メソッドの実装
- [x] TypeScript型安全性向上（isRegex ?? falseでundefined対応）
- [x] 回帰テスト実行（ユニットテスト108/108、E2Eテスト5/5）
- [x] スクラム02記録の作成
