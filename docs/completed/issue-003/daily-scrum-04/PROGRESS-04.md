# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

## スクラム04-1回目の進捗

- `PLAN.md`の`### Step 3: 変換ロジックの分離 (Strategyパターン)`の実施。
    - `DomConverterStrategy.ts` (インターフェース) の定義。
    - `DefaultDomConverter.ts` (一般的な要素の変換戦略) の実装。
    - `TableDomConverter.ts` (テーブル関連要素の変換戦略) の実装。
    - `DomConverterFactory.ts` (タグ名に応じた変換戦略を返すファクトリ) の作成。
- 上記クラス群の単体テストの作成。
- `HtmlReplacer.ts`を、新しく作成したクラスを利用するようにリファクタリング。
- `HtmlString.ts`から不要な`toDomNode`メソッドと関連するプライベートメソッドを削除。
- `HtmlString.ts`の`isValid`メソッドを修正し、空文字列や純粋なテキストも有効なHTMLとして扱えるように変更。
- `TagName.ts`の`isTableRelated`メソッドを修正し、`table`タグを正しくテーブル関連タグとして認識するように変更。
- `TableDomConverter.ts`の`convert`メソッドを修正し、`table`タグの変換が正しく行われるように変更。
- すべての単体テストが通過することを確認。

### スクラム04-1回目のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
frog-frame-front/host-frontend-root/frontend-src-root/src/domain/entities/__tests__/DefaultDomConverter.test.ts
のテストケースを、
frog-frame-front/host-frontend-root/frontend-src-root/src/domain/entities/__tests__/HtmlReplacer.test.ts
を参考に共通化してください。
kk=04
実装が完了したらPROGRESS-04.mdを追記してコードレビューを依頼してください
---

## スクラム04-2回目の進捗

- `DefaultDomConverter.test.ts` のテストケースを、`HtmlReplacer.test.ts` を参考に共通化しました。
- すべての単体テストが通過することを確認しました。

### スクラム04-2回目のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
- TableDomConverter.test.ts のテストケースを、`HtmlReplacer.test.ts` を参考に共通化してください。
- テストを実行するときは、
```
cd ~/absolute-path/to/frog-frame-front/host-frontend-root/frontend-src-root && docker compose exec frontend npm run test
```
によってDockerコンテナ内で実行してください。
kk=04
実装が完了したらPROGRESS-04.mdを追記してコードレビューを依頼してください

---

## スクラム04-3回目の進捗

- `TableDomConverter.test.ts` のテストケースを、`HtmlReplacer.test.ts` を参考に共通化しました。
- Dockerコンテナ内で全ての単体テストが通過することを確認しました。

### スクラム04-3回目のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
kk=04
実装が完了したらPROGRESS-04.mdを追記してコードレビューを依頼してください