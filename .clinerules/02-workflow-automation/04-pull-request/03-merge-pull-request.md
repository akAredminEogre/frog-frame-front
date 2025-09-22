workflow:merge-pull-request
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
pr_no=(カレントブランチが出しているプルリクエストの番号)
pr_noのプルリクエストをマージします。次の手順でマージしてください。
- ドキュメントテンプレートの削除
  - docs/issue-nnn/daily-scrum-00/ (本issue内のテンプレートのディレクトリ、番号がついているものは残す)を削除
    - コミットメッセージ
      - docs: issue-nnnのテンプレートファイルを削除
- 下記のファイルでコミットされていない物があればコミット
  - issues.md
    - コミットメッセージ
      - docs: 新規・追加・残タスク
  - WITH_CLINE.md
    - コミットメッセージ
      - docs: CLINEへの指示改善
- issue-nnnのディレクトリを、completed/issue-nnnに移動する
- 現在のブランチで残っている変更があればすべてコミットしてプッシュ
  - コミットメッセージは「issue-nnn: プルリクエストの内容を反映」
- プルリクエストを`create a merge commit`でマージする
- developにチェックアウトし、pullする
```