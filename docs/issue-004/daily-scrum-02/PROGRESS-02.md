# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

## スクラム02-(1回目) の進捗

- UI層の修正とUXの改善
  - ルール設定画面に正規表現の有効/無効を切り替えるチェックボックスを追加しました。
  - `App.tsx` を修正し、チェックボックスの状態を `RewriteRule` の `isRegex` プロパティに反映させるようにしました。
  - `background.ts` の `RewriteRule` 型定義を更新しました。
  - `TextReplacer.ts` を修正し、`isRegex` フラグに基づいて正規表現の有効/無効を切り替えるようにしました。
  - `TextReplacer.ts` のTypeScriptエラーを修正しました。

### スクラム02-(1回目) のレビューコメント
- TextReplacer.tsの修正は、本スクラムでは一旦範囲外としておいてください。そのため、`TextReplacer.ts` の修正はこちらで元に戻しておきました。もしエラーがでるようであればまた考えましょう
- App.tsx
  - `type RewriteRule`は`RewriteRule.ts` に定義されているものをインポートして使うようにしてください。これにより、型の一貫性が保たれます。
  - `useState<RewriteRule>`,`setRewriteRule` も同様に`RewriteRule.ts` からインポートして使用してください。
- background.ts
  - `type RewriteRule`は`RewriteRule.ts` に定義されているものをインポートして使うようにしてください。これにより、型の一貫性が保たれます。
<!-- ここはユーザが書くので空欄にしておいてください。 -->
kk=02
実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
---

## スクラム02-(2回目) の進捗

- レビューコメントへの対応
  - `App.tsx` で `RewriteRule` 型を `RewriteRule.ts` からインポートするように修正しました。
  - `background.ts` で `RewriteRule` 型を `RewriteRule.ts` からインポートするように修正しました。

### スクラム02-(2回目) のレビューコメント
kk=02
- App.tsx
  - `setRewriteRule({ oldString: '', newString: '', urlPattern: '', isRegex: false });`は`RewriteRule.ts` に定義されているものをインポートして使うようにしてください。これにより、型の一貫性が保たれます。
- background.ts
  - `import { RewriteRule } from '../src/domain/entities/RewriteRule';`は使われていないようです。問題がないか確認して削除してください


実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
---

## スクラムkk-(i回目) の進捗

<!-- ここに進捗を記載 -->

### スクラムkk-(i回目) のレビューコメント
kk=
<!-- ここはユーザが書くので空欄にしておいてください。 -->

実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
