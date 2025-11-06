# 概要
<!-- このチケットで解決したい課題 -->
- 現在、await chrome.storage.local.set({ [rule.id]: rule });となっていますが、ruleのオブジェクトだけ別個にできるよう、
await chrome.storage.local.set({ RewriteRules: { [rule.id]: rule } });
のようにしてください。
- RewriteRuleのファーストコレクションオブジェクトを作成し、RewriteRuleRepositoryのgetAllやsaveで使用するようにしてください。
- saveでは、RewriteRulesオブジェクトを丸ごと保存するようにしてください。

## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->