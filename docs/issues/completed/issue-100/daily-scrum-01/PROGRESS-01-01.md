# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=01
実装が完了したらPROGRESS-01-01.mdを追記してコードレビューを依頼してください
## スクラム-01(01回目) の進捗
<!-- ここに進捗を記載 -->

RewriteRuleのidの型を`string | number`に変更し、テストコードを修正しました。全ての単体テスト(279件)が成功しました。

### 修正したファイル

- host-frontend-root/frontend-src-root/src/domain/entities/RewriteRule/RewriteRule.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/entities/RewriteRule/constructor/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/entities/RewriteRule/addHtmlWhitespaceIgnoringPattern/reflection-tests.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlContent/edge-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlContent/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlContent/regex-rule.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlReplacer/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlReplacer/regex-pattern.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/constructor/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/toArray/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/toObject/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/getById/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/getById/Abend/error-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/set/normal-cases.test.ts


### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->

なし

### 本issueの対象外とする課題

なし

### スクラム-01(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->
ありがとうございます。いくつかの変更をレビューし、コミットしました。
今残っている変更のうち、
```
   rulesObject = {
      '1': rule1,
      '2': rule2,
    };
```
のようになっているものがありますが、仮にRewriteRuleのidがnumber型だけになったとき(string型が廃止になったとき)もこの変更は問題ないでしょうか？もし問題がある場合は、idをnumber型に変更したときのことも考慮して修正してください。
---
