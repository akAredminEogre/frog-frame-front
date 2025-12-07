# DAILY SCRUM-02回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
PLAN.mdの計画の残りタスクである「.clinerules内の採番指示を、作成したシェルスクリプトを実行する形式に変更する」作業に取り組みます。
具体的には、.clinerules内の各ワークフローファイルで直接採番を行っている箇所を、作成した`scripts/.clinerules/get-issue-number.sh`を実行する形式に変更します。

## 修正予定ファイル
- .clinerules内の各ワークフローファイル（採番指示が含まれるファイル）
- 該当箇所を調査して特定し、シェルスクリプト実行形式に変更

## スクラム内残タスク
- [x] .clinerules内の採番指示箇所を調査・特定する
- [x] 各ワークフローファイルでシェルスクリプトを実行する形式に変更する
- [x] 変更後の動作確認を実施する

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
シェルスクリプトの活用により、採番処理の統一化と効率化が図れそうです。

# DAILY SCRUM-02作業実績
## 本スクラムでの作業実績内容
.clinerules内の採番指示を、作成したシェルスクリプトを実行する形式に変更しました。
具体的には、.clinerules内の19個のワークフローファイルで使用されている `nnn=(カレントブランチ名からissue番号を取得)` の記述を `nnn=$(scripts/.clinerules/get-issue-number.sh)` に一括変更し、動作確認を完了しました。

## 修正したファイル
.clinerules内の以下19個のファイルを修正：
- 02-workflow-automation/03-daily-scrum-finishes/ (6ファイル)
- 02-workflow-automation/04-pull-request/ (5ファイル)
- 02-workflow-automation/02-daily-scrum-starts/ (5ファイル)
- 02-workflow-automation/01-issue-launches/ (3ファイル)