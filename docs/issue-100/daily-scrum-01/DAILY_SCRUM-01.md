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
- [ ] RewriteRuleのidのtypeをstring | numberに変更する
- [ ] テストコードでidに文字列を与えている箇所を数値に修正する
- [ ] test:allを実行し、全テストが通ることを確認する
- [ ] 不具合が出た箇所を適宜修正する

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

## 修正したファイル
