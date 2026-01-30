# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->


## Story-1: 開発者としてHtmlReplacerの責務を適切に配置することでコードの保守性を向上させる

HtmlReplacerクラスのインスタンス化と管理をcontent.tsからApplySavedRulesOnPageLoadUseCaseクラスに移管し、より適切なアーキテクチャに改善する。

### タスク

- [x] content.tsからHtmlReplacerのimportを削除
- [x] ApplySavedRulesOnPageLoadUseCaseでHtmlReplacerを内部生成するように修正
- [x] 依存性注入パターンから自己完結型に変更
- [x] スクラム記録を作成
