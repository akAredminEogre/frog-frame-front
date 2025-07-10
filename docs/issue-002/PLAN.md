# Issueの計画

NodeTextReplacerのリファクタリング計画を立てます。CODING_STYLE.mdのオブジェクト指向ルールに基づき、責務を分割し、コードの可読性と保守性を向上させることを目指します。

## Story-1: 開発者として、NodeTextReplacerの責務を分割し、コードの保守性を向上させる

`NodeTextReplacer` が持つHTML置換とテキスト置換の2つの大きな責務を、それぞれ独立したクラスに分割します。これにより、各クラスが単一の責任を持つようになり、コードの見通しが良くなります。

### タスク

-   [x] `RewriteRule` の `oldString` がHTML文字列かプレーンテキストかを判定するロジックを持つ `ReplacementValue` ValueObjectを作成する。
-   [x] `ReplacementValue` のユニットテストを作成する。
-   [ ] プレーンテキストの置換ロジック責務を持つ `TextReplacer` クラスを作成する。
-   [ ] `TextReplacer` のユニットテストを作成する。
-   [ ] HTML要素の置換ロジック責務を持つ `HtmlReplacer` クラスを作成する。
-   [ ] `HtmlReplacer` のユニットテストを作成する。
-   [ ] `NodeTextReplacer` をリファクタリングし、`ReplacementValue` を使って処理を `TextReplacer` または `HtmlReplacer` に委譲するファサードにする。
-   [ ] `NodeTextReplacer` の既存のユニットテストを、リファクタリング後の構造に合わせて修正する。
-   [ ] 既存のE2Eテストがすべて通過することを確認する。
