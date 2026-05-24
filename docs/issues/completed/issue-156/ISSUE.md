# 概要
<!-- このチケットで解決したい課題 -->
user-story-001の前提タスクとして、RulesApp.tsxをframeworks-and-drivers層へ移行する。

## 関連リンク
- [user-story-001](../user-stories/user-story-001/README.md)
- 親ブランチ: claude/issue-155-user-story-001-AJWvY

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->
- [x] RulesApp.tsx が src/frameworks-and-drivers/ui/pages/rules/ に移行されている
- [x] style.css が同ディレクトリに移行されている
- [x] entrypoints/rules/main.tsx のimportパスが更新されている
- [x] RulesApp.tsx内のstyle.css importパスが更新されている

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->
- なし

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->
- ロジック変更なし、パス変更のみ

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->
- [x] frameworks-and-drivers/ui/pages/rules/ ディレクトリを作成
- [x] RulesApp.tsx と style.css を移動
- [x] importパスを更新
