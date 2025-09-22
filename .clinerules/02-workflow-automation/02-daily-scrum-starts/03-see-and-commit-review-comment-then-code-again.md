workflow:see-and-commit-review-comment-then-code-again

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
ii=(docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdの進捗の最大の番号。01から始まる連番。ない場合はii=01)
favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
に、
### スクラムkk-(ii回目) のレビューコメント
としてレビューコメントを記載しました。

まず下記の対象ファイルのみドキュメントをコミットしてください。
  - 対象：favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
  - コミットメッセージ
    - docs: スクラムkk ii回目のコードレビュー
  他のファイルはまだコミットしないでください

その内容に沿って、修正を行ってください。
修正の際には、
workflow:code-according-to-the-rules
を参照しながら進めてください。

実装が完了したら下記の方法で進捗をまとめてください
workflow:record-progress


```