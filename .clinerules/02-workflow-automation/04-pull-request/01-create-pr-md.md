workflow-create-pr-md
```cline-instructions
nnn=$(scripts/.clinerules/get-issue-number.sh)
issue-nnnのプルリクエストの本文を作成してください。

反映すべき内容：
frog-frame-front/docs/issue-nnn/
以下のドキュメント群(ない場合はdevelopとの比較で変更があるもの)

従うべきフォーマット：
frog-frame-front/docs/issue-000/PULL_REQUEST.md

保存先：
docs/issue-nnn/PULL_REQUEST.md

作成時の注意：
- 受け入れ条件の項目数/番号をPR説明文に書かないこと(条件や個数が変わる可能性があるため、acceptance-criteria.mdへのリンクのみ記載する)

作成後のチェック：
- [ ] PR説明文で数値を使っている場合、本文の項目数と一致しているか確認(例: 「6ファイル」と書いて実際は7ファイルなど)
- [ ] PR説明文で言及した関数・クラス・ファイル等が実際に実装されているか確認（grep等で存在確認）
- [ ] 実装した全てのテストカテゴリ/機能がPR説明文に記載されているか確認（漏れチェック）
```