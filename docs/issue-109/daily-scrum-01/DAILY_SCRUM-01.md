# DAILY SCRUM-01回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
package.jsonのスクリプト名変更に対応したmakeコマンドの作成・修正とドキュメント修正を行います。

具体的には以下の変更に対応します：
- `test` → `test:unit`
- `test-and-lint` → `test:lint`
- `test-and-check` → `test:check`

## 修正予定ファイル
- `Makefile` (test-and-check, test-and-lint コマンドの修正)
- `CLAUDE.md` (ドキュメント内の該当コマンドの修正)

## スクラム内残タスク
- [ ] Makefileのtest-and-checkコマンドをtest:checkに対応
- [ ] Makefileのtest-and-lintコマンドをtest:lintに対応
- [ ] CLAUDE.md内のtest-and-checkコマンドの説明を修正
- [ ] CLAUDE.md内のtest-and-lintコマンドの説明を修正
- [ ] CLAUDE.md内のtestコマンドの説明をtest:unitに修正
- [ ] 修正後のテスト実行（make test-and-lintの動作確認）

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
package.jsonのスクリプト名が変更されたので、それに対応してMakefileとドキュメントを更新する作業です。シンプルな修正なので、スムーズに進められそうです。

# DAILY SCRUM-01作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

## 修正したファイル
