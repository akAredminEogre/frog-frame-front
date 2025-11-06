# DAILY SCRUM-01回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
- RewriteRuleのidのtypeをstring | numberに変更し、テストを修正して全テストが通ることを確認する

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
- src/domain/entities/RewriteRule/RewriteRule.ts (idのtype定義を変更)
- tests/unit/domain/entities/RewriteRule/ 配下のテストファイル (文字列idを数値idに変更)
- その他、test:allの実行結果で判明する箇所

## スクラム内残タスク
- [x] RewriteRuleのidのtypeをstring | numberに変更する
- [x] テストコードでidに文字列を与えている箇所を数値に修正する
- [x] test:allを実行し、全テストが通ることを確認する
- [x] 不具合が出た箇所を適宜修正する

## 相談事項
<!-- workflow-01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->
<!-- ユーザーが使うコマンド: frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-discussion-then-start-coding.md-->

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->
IndexedDB移行への準備として、RewriteRuleのid型を柔軟にする重要な一歩です。テストの修正量が予想できないため、慎重に進めます。

# DAILY SCRUM-01作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

### イテレーション01: RewriteRule.idの型変更とテストコード修正

RewriteRuleのidの型を`string | number`に変更し、関連するテストコードを修正しました。全ての単体テスト(277件)が成功しました。

### イテレーション02: テストコードのオブジェクトリテラルの修正

レビューコメントに基づき、テストコードのオブジェクトリテラルを文字列キー（`'1': rule1`）から数値キー（`1: rule1`）に変更しました。将来RewriteRule.idがnumber型のみになった場合でも、テストコードの意図が明確になるようにしました。

### イテレーション03: プロパティアクセスの修正

レビューコメントに基づき、プロパティアクセスも文字列キー（`object['1']`）から数値キー（`object[1]`）に変更しました。オブジェクトリテラルとプロパティアクセスの両方で一貫性が保たれました。

### イテレーション04: getByIdメソッドのシグネチャ変更

レビューコメントに基づき、`RewriteRules.getById`のパラメータ型を`id: string`から`id: string | number`に変更しました。メソッド内で受け取ったidを`String(id)`で文字列に変換し、内部のMapは引き続き文字列キーを使用することで既存の動作を維持しました。

テストコードでも`getById`の呼び出しを文字列ID（`'1'`）から数値ID（`1`）に変更し、テストコード全体で一貫して数値IDを使用するようにしました。

これにより、以下の点で一貫性が確保されました:
- オブジェクトリテラル: `{1: rule1, 2: rule2}`
- プロパティアクセス: `object[1]`, `object[2]`
- メソッド呼び出し: `getById(1)`, `getById(2)`

全てが数値を使用し、RewriteRule.idがnumber型であることがテストコード全体で明確になりました。

## 修正したファイル

### イテレーション01
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

### イテレーション02
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/constructor/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/getById/Abend/error-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/getById/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/set/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/toArray/normal-cases.test.ts

### イテレーション03
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/constructor/normal-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/set/normal-cases.test.ts

### イテレーション04
- host-frontend-root/frontend-src-root/src/domain/value-objects/RewriteRules.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/getById/Abend/error-cases.test.ts
- host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/getById/normal-cases.test.ts
