# DAILY SCRUM-10回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
`chrome.tabs.create({ url: chrome.runtime.getURL(\`edit.html?ruleId=${ruleId}\`) })` のinfrastructure層への移管

## 修正予定ファイル
- src/application/ports/IChromeTabsService.ts
- src/infrastructure/browser/tabs/ChromeTabsService.ts
- src/pages/rules/components/RulesApp.tsx
- tests/unit/infrastructure/browser/tabs/ChromeTabsService/ (新規テストファイル)

## スクラム内残タスク
- IChromeTabsServiceインターフェースにopenEditPageメソッドを追加
- ChromeTabsServiceに実装を追加
- RulesApp.tsxの該当箇所を新しいメソッドに置き換え
- 単体テストの作成

## 相談事項
特になし

## 一言コメント
infrastructure層への責務集約を進め、アーキテクチャをよりクリーンにしていきます

# DAILY SCRUM-10作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

## 修正したファイル
