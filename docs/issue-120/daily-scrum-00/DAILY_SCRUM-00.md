# DAILY SCRUM-00回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
- package.jsonからno-sortコマンドを削除
- no-sortコマンドの削除による影響範囲を調査・対応

## 修正予定ファイル
- host-frontend-root/frontend-src-root/package.json

## スクラム内残タスク
- [ ] package.json内のno-sort関連コマンドを特定
- [ ] lint:no-sortコマンドを削除
- [ ] lint:fix:no-sortコマンドを削除
- [ ] unused:fix内のlint:fix:no-sortをlint:fixに変更
- [ ] test:check内のlint:no-sortをlintに変更
- [ ] make testlintで動作確認

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
シンプルなリファクタリング作業。全ファイルのimportソート完了を受けて、不要になったno-sortコマンドを削除します。

# DAILY SCRUM-00作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

## 修正したファイル
