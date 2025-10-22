workflow-submit-pull-request

```cline-instructions
- issue番号の取得
  - nnn=(カレントブランチ名からissue番号を取得)
- PRドキュメントのコミット
- 対象
  - frog-frame-front/docs/issue-nnn/PULL_REQUEST.md
  - コミットメッセージ
    - docs: PULL_REQUEST.mdの作成、レビュー完了
- 現時点のブランチをpush
  - コミットされていない変更はそのまま
  - push先リポジトリ akAredminEogre/frog-frame-front
- ghコマンドによるPR作成
  - base branch: develop
  - title: `PULL REQUEST.md`の`## タイトル`を利用
  - body: `PULL REQUEST.md`の内容を利用
  - コミットされていない変更はそのままで、プルリクエストを作成してください。
```