# DAILY SCRUM

## 日付

YYYY/MM/DD (X回目)

## 今日の作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->

## 修正予定のファイル
<!-- 修正予定のファイルを記載してください。 -->

## 相談事項
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [ ] 作業を始める前に、ユーザとデイリースクラムを実施した
- [ ] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [ ] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した

# DAILY SCRUM

## 日付

2025/07/10 (1回目)

## 今日の作業予定

Story-1: 開発者として、NodeTextReplacerの責務を分割し、コードの保守性を向上させる

-   [ ] `RewriteRule` の `oldString` がHTML文字列かプレーンテキストかを判定するロジックを持つ `ReplacementValue` ValueObjectを作成する。
-   [ ] `ReplacementValue` のユニットテストを作成する。

## 修正予定のファイル

-   `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/ReplacementValue.ts` (新規作成)
-   `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/__tests__/ReplacementValue.test.ts` (新規作成)

## 相談事項

特にありません。計画通りに進めます。

## 一言コメント

リファクタリングの第一歩、まずはValueObjectから堅実に進めていきたいと思います！

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [x] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [x] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した

2025/07/10 (2回目)

## 今日の作業予定

`PLAN.md` に基づき、`NodeTextReplacer` のリファクタリングを次のステップに進めます。

-   [ ] プレーンテキストの置換ロジック責務を持つ `TextReplacer` クラスを作成する。
-   [ ] `TextReplacer` のユニットテストを作成する。

## 修正予定のファイル

-   `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/TextReplacer.ts` (新規作成)
-   `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/__tests__/TextReplacer.test.ts` (新規作成)

## 相談事項

特にありません。計画通りに進めます。

## 一言コメント

前回作成した `ReplacementValue` を活用し、まずはプレーンテキストの置換ロジックを分離する `TextReplacer` の実装から着手します。

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [x] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [x] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した


---

# DAILY SCRUM

## 日付

2025/07/10 (3回目)

## 今日の作業予定

`PLAN.md` に基づき、`NodeTextReplacer` のリファクタリングを次のステップに進めます。

-   [ ] HTML要素の置換ロジック責務を持つ `HtmlReplacer` クラスを作成する
-   [ ] `HtmlReplacer` のユニットテストを作成する

## 修正予定のファイル

-   `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/HtmlReplacer.ts` (新規作成)
-   `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/__tests__/HtmlReplacer.test.ts` (新規作成)

## 相談事項

HtmlReplacerの実装において、以下の点について確認が必要かもしれません：
- HTML要素の置換時の安全性（XSS対策など）
- DOM操作の最適化方針
- 既存のNodeTextReplacerとの互換性

## 一言コメント

前回のTextReplacerに続き、HTML置換ロジックの分離に取り組みます。責務分割によるコードの整理が順調に進んでいて、設計の見通しが良くなってきました！

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [x] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [x] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した

---

# DAILY SCRUM

## 日付

2025/07/11 (追加作業)

## 今日の作業予定

VS Codeのソース管理で実際に差分がないファイルが変更として表示される問題の調査と解決

## 修正予定のファイル

権限の修正のみ、ファイル内容の変更なし

## 相談事項

特にありません。

## 一言コメント

権限問題という想定外の技術的問題でしたが、適切に解決できて良かったです！今後はDocker環境での権限管理に注意が必要ですね。

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [x] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [x] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した

---

# DAILY SCRUM

## 日付

2025/07/11 (1回目)

## 今日の作業予定

Story-1: 開発者として、NodeTextReplacerの責務を分割し、コードの保守性を向上させる

-   [ ] `NodeTextReplacer` をリファクタリングし、`ReplacementValue` を使って処理を `TextReplacer` または `HtmlReplacer` に委譲するファサードにする。
-   [ ] `NodeTextReplacer` の既存のユニットテストを、リファクタリング後の構造に合わせて修正する。
-   [ ] 既存のE2Eテストがすべて通過することを確認する。

## 修正予定のファイル

-   `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/NodeTextReplacer.ts`
-   `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/__tests__/NodeTextReplacer.test.ts`

## 相談事項

特にありません。計画通りに進めます。

## 一言コメント

いよいよリファクタリングの最終段階です。`NodeTextReplacer` を綺麗なファサードにして、このチケットを完了させます！

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [x] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [ ] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した
