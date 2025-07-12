# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

## スクラム02-(1回目) の進捗

- **値オブジェクトの導入**:
  - `HtmlString.ts`: HTML文字列を扱う値オブジェクトを作成しました。コンストラクタで簡単なバリデーションを行います。
  - `TagName.ts`: タグ名を扱う値オブジェクトを作成しました。コンストラクタでバリデーションと小文字化を行います。
  - `HtmlReplacer.ts`: `HtmlString`値オブジェクトを使用するようにリファクタリングしました。不正なHTML文字列が渡された場合に例外をキャッチし、置換を行わないように修正しました。

- **単体テストの作成と修正**:
  - `HtmlString.test.ts`: `HtmlString`値オブジェクトの単体テストを作成しました。
  - `TagName.test.ts`: `TagName`値オブジェクトの単体テストを作成しました。
  - `HtmlReplacer.ts`の修正に伴い、失敗していたテストが成功することを確認しました。

- **テスト結果**:
  - すべての単体テスト（49テスト）が成功することを確認しました。

**完了したタスク:**
- ✅ `src/domain/value-objects/HtmlString.ts` を作成した
- ✅ `HtmlString`値オブジェクトにHTML文字列のカプセル化、DOM変換、不正HTML検証を実装した
- ✅ `src/domain/value-objects/TagName.ts` を作成した
- ✅ `TagName`値オブジェクトにタグ名の検証とカプセル化を実装した
- ✅ `HtmlString.test.ts` を作成し、単体テストを実装した
- ✅ `TagName.test.ts` を作成し、単体テストを実装した
- ✅ `HtmlReplacer.ts`をリファクタリングし、新しい値オブジェクトを利用するように実装を調整した
- ✅ 既存の`HtmlReplacer.test.ts`が引き続きパスすることを確認した

**コードレビュー依頼:**
`HtmlReplacer`のリファクタリング（値オブジェクト導入）が完了しました。
以下のファイルについてコードレビューをお願いいたします。
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/HtmlString.ts`
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/TagName.ts`
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/HtmlReplacer.ts`
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/__tests__/HtmlString.test.ts`
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/__tests__/TagName.test.ts`

### スクラム02-(1回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
- TextReplacerの変更は今回のissueの範囲外です。一旦変更を取り消してください。
- HtmlReplacerの
```
if (['tbody', 'thead', 'tfoot', 'tr', 'td', 'th', 'caption'].includes(lowerTagName)) {
```
のロジックは、TagName.isTableRelatedに実装済みのロジックで対応できないか検討してください。
---

## スクラム02-(2回目) の進捗

- **レビューコメントへの対応**:
  - `HtmlString.ts`: `toDomNode`メソッド内のテーブル関連タグの判定ロジックを、`TagName.isTableRelated`メソッドを利用するように修正しました。
  - `TextReplacer.ts`: Issue範囲外の変更だったため、元のシンプルな実装に戻しました。

- **テスト結果**:
  - すべての単体テストが成功することを確認しました。

**完了したタスク:**
- ✅ `HtmlString.ts`のロジックを`TagName`値オブジェクトを利用するように修正した
- ✅ `TextReplacer.ts`の変更を取り消した
- ✅ 全てのテストがパスすることを確認した

**コードレビュー依頼:**
レビューコメントへの対応が完了しました。
以下のファイルについて再度コードレビューをお願いいたします。
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/HtmlString.ts`
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/TextReplacer.ts`

### スクラム02-(2回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
`toDomNode(tagNameContext: string): Node` のコードがまだネストが深いです。CODING_STYLE.mdのルールに従い、ネストを浅くするように修正してください。
kk=02
実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
---

## スクラム02-(3回目) の進捗

- **レビューコメントへの対応**:
  - `HtmlString.ts`: `toDomNode`メソッドのネストが深かったため、早期リターンとメソッド抽出を用いてリファクタリングしました。

- **テスト結果**:
  - すべての単体テストが成功することを確認しました。

**完了したタスク:**
- ✅ `HtmlString.ts`の`toDomNode`メソッドをリファクタリングした
- ✅ 全てのテストがパスすることを確認した

**コードレビュー依頼:**
レビューコメントへの対応が完了しました。
以下のファイルについて再度コードレビューをお願いいたします。
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/value-objects/HtmlString.ts`

### スクラム02-(3回目) のレビューコメント
kk=02
ありがとうございました。今回の作業は終了にします。振り返りを行い、PLAN.md/RETROSPECTIVE.md/DAILY_SCRUM.mdを更新してください
- PLAN.md
  - step 2の値オブジェクトの導入が完了したことを記載
- RETROSPECTIVE.md
  - スクラム02の振り返りを記載
- DAILY_SCRUM-kk.md
  - チェックリストを更新