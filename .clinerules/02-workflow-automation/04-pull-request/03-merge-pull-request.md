workflow:merge-pull-request
```cline-instructions
- issue番号、プルリクエスト番号の取得
  - nnn=(カレントブランチ名からissue番号を取得)
  - pr_no=(カレントブランチが出しているプルリクエストの番号)
- マージ前定型作業
  - ドキュメントテンプレートの削除
    - docs/issue-nnn/daily-scrum-00/ (本issue内のテンプレートのディレクトリ、番号がついているものは残す)を削除
    - コミットメッセージ
      - docs: issue-nnnのテンプレートファイルを削除
  - 残ファイルコミット
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
- PRのマージ
  - ghコマンドで、`pr_no`のプルリクエストを`create a merge commit`でマージする
- マージ後作業
  - developにチェックアウトし、pullする
```