# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [x] プロダクションコード、テストコード、ドキュメント中のfrog-frame-frontをfavorite-keyword-link-frogに変更
- [x] リポジトリ名変更の方針決定（開発者が手動でGitHubリポジトリ名を変更、再クローンで対応）

# ISSUEを通した相談事

## リポジトリ名変更に関する技術調査結果

### 1. コミット履歴とコミット日時の維持について
**結論: 維持される**

GitHubの公式ドキュメントによると、リポジトリ名を変更しても、以下の既存情報は自動的に新しい名前にリダイレクトされる:
- Issues
- Wikis
- Stars
- Followers

また、`git clone`、`git fetch`、`git push`などの操作は、古い場所を指していても新しい場所で機能し続けることが明記されている。
これらのことから、リポジトリの全履歴（コミット履歴とコミット日時を含む）は完全に維持されると判断できる。

### 2. developブランチのマージタイミングについて
**結論: マージせずにリポジトリ名変更可能**

GitHubの公式ドキュメントには、リポジトリ名変更前にブランチをマージする必要があるという記載はない。
すべての既存情報（全ブランチを含む）が自動的にリダイレクトされるため、developブランチをmainにマージせずにリポジトリ名を変更しても問題ない。

ただし、名前変更後は、ローカルクローンのリモートURLを更新することが強く推奨される:
```bash
git remote set-url origin NEW_URL
```

### 3. 注意事項
- 将来、元のリポジトリ名（frog-frame-front）を再利用すると、リダイレクトが機能しなくなる
- GitHub Actionsを使用している場合、リポジトリ名を参照している箇所の更新が必要になる可能性がある

参考: [GitHub Docs - Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)

# 残タスク
<!-- issueの進捗に応じて記入 -->
