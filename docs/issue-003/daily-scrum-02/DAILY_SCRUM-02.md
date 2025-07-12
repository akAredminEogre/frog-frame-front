# DAILY SCRUM-02回目

## 本スクラムの作業予定
PLAN.mdのStep 2「値オブジェクトの導入」に取り組みます。
`CODING_STYLE.md`のオブジェクト指向ルール「すべてのプリミティブ型と文字列型をラップすること」に従い、`HtmlString`と`TagName`という2つの値オブジェクトを作成し、`HtmlReplacer`に適用します。

## 修正予定のファイル
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/HtmlReplacer.ts`
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/HtmlString.ts` (新規作成)
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/TagName.ts` (新規作成)
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/__tests__/HtmlString.test.ts` (新規作成)
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/__tests__/TagName.test.ts` (新規作成)

## 相談事項
- 値オブジェクトの責務分離（特にDOM変換ロジックをどこまで担当させるか）について、実装を進める中でレビューをお願いしたいです。
- `innerHTML`による置換という現在の`HtmlReplacer`の実装方針と、DOMベースの操作を内包する値オブジェクトとの整合性の取り方について、ご意見を伺いたいです。

## 一言コメント
リファクタリングの核心に触れる値オブジェクトの導入、楽しみです！綺麗なコードを目指して頑張ります。

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [x] 作業完了後、PROGRESS-02.mdに進捗を記載し、レビューを依頼した
- [x] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した
