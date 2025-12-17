# 概要
ChromeRuntimeRewriteRuleRepository.ts を `src/frameworks-and-drivers/messaging/` へ移行する。
Clean Architectureの層分離を進め、Chrome Runtime APIを使用したリポジトリをframeworks-and-drivers層に配置する。

## 関連リンク
- issue-155: ユーザーストーリー001
- issue-157: container.tsのframeworks-and-drivers移行

# 受け入れ条件
- ChromeRuntimeRewriteRuleRepository.ts が `src/frameworks-and-drivers/messaging/` に移動されている
- 関連するimportパスがすべて更新されている
- make testlint が成功する

# 心配事
- importパスの変更漏れ

# 制限事項
- なし

# タスク
- [ ] ChromeRuntimeRewriteRuleRepository.ts をframeworks-and-drivers/messaging/へ移動
- [ ] 関連ファイルのimportパスを修正
- [ ] テスト実行と確認
