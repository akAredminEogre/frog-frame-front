# DAILY SCRUM-01回目

## 本スクラムの作業予定
正規表現によるDOM置換機能の実装に着手します。E2Eテスト `replace-inside-dom-with-regex.spec.ts` を通過させるため、`HtmlContent.ts` の `createRedundantPattern` メソッドを修正します。**重要**：正規表現でも改行無視のロジックは適用しますが、非キャプチャグループ `(?:\\s*)` を使用してユーザーのキャプチャグループ番号がずれないようにします。

具体的には：
- 正規表現パターン：`<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue">(.+?)</span></li>`
- 置換後：`<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/$1">$1</a></span></li>`
- キャプチャグループ`(.+?)`で取得したISBN番号が`$1`として正しく埋め込まれることを確認

## 修正したファイル
- `host-frontend-root/frontend-src-root/src/domain/entities/HtmlContent.ts`
  - `createRedundantPattern`メソッドの修正
  - 正規表現でも改行無視の変換（`<` → `(?:\\s*)<`、`>` → `>(?:\\s*)`）を適用
  - 非キャプチャグループ`(?:\\s*)`を使用してユーザーのキャプチャグループ番号がずれないよう実装

- `host-frontend-root/frontend-src-root/src/domain/entities/HtmlContent.test.ts` (新規作成)
  - 正規表現パターンでのキャプチャグループ置換のテストケース追加
  - 通常文字列での置換の回帰テスト追加

## 相談事項
- 正規表現パターンの処理において、不正な正規表現が入力された場合のエラーハンドリングをどの程度実装すべきでしょうか。現在のE2Eテストでは正常なパターンのみを扱っていますが、実際のユーザー利用を考慮すると、不正なパターンに対する適切なエラーメッセージの表示やバリデーション機能も必要かもしれません。
  - 一旦エラーは無視で構いません

- また、既存の文字列置換機能との互換性を保ちながら、正規表現機能を追加する際に見落としがちな edge case があれば教えてください。
  - edge caseではありませんが、正規表現を使用する場合でも、改行無視のロジックは適用してください。`<`と`>`前後の空白を無視する正規表現は()で囲まなければ、キャプチャグループに含まれないはずです。そうすれば、ユーザーが入力したキャプチャグループをそのまま使用できるはずです。

## 一言コメント
正規表現機能の実装は、ユーザーの使い勝手を大幅に向上させる重要な機能なので、確実に動作するよう丁寧に実装していきたいと思います。
