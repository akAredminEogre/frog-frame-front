workflow:re-submit-pull-request

```cline-instructions
- issue番号の取得
  - nnn=(カレントブランチ名からissue番号を取得)
- PRドキュメントのコミット
- 対象
  - favorite-keyword-link-frog/docs/issue-nnn/PULL_REQUEST.md
  - コミットメッセージ
    - docs: PULL_REQUEST.mdの変更、レビュー完了
- 現時点のブランチをpush
  - コミットされていない変更はそのまま
  - push先リポジトリ akAredminEogre/favorite-keyword-link-frog
- ghコマンドによる既存PRの更新
  - PR番号の取得
    - gh pr list --repo akAredminEogre/favorite-keyword-link-frog --head issue-nnn --json number --jq '.[0].number'
  - title: `PULL REQUEST.md`の`## タイトル`を利用
  - body: `PULL REQUEST.md`の内容を利用
  - コミットされていない変更はそのままで、プルリクエストを変更してください。
```
