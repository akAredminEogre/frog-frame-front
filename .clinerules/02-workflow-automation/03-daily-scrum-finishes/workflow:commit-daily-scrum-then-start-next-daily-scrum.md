workflow:commit-daily-scrum-then-start-next-daily-scrum

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示はあなたの確認のために行うものなので、開発者の指示・操作を待たずその表示した手順に従って実行してください

```cline-instructions
- デイリースクラムドキュメントのコミット
  - workflow:commit-daily-scrum
    - の手順に従う

- 次のデイリースクラムドキュメントの作成
  - 上記作業終了後、
  - workflow:create-daily-scrum
  - の手順を実行し、次のデイリースクラム用のMarkdownを作成してください
```