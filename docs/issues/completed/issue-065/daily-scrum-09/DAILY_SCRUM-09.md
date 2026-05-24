# DAILY SCRUM-09回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
'applyAllRules'メッセージ送信ロジックをinfrastructure層に集約する

## 修正予定ファイル
- src/application/ports/IChromeTabsService.ts
- src/infrastructure/browser/tabs/ChromeTabsService.ts
- src/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase.ts
- src/infrastructure/browser/listeners/tabs.onUpdated.ts
- src/infrastructure/browser/router/messageHandlers.ts
- tests/unit/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase/execute/normal-cases.test.ts
- tests/unit/infrastructure/browser/router/handlers/applyAllRules.test.ts

## スクラム内残タスク
なし

## 相談事項
特になし

## 一言コメント
コードの重複を減らして、保守性を向上させます

# DAILY SCRUM-09作業実績
## 本スクラムでの作業実績内容
`'applyAllRules'` メッセージ送信ロジックをinfrastructure層の `ChromeTabsService` に集約しました。

### 実施内容
1. **'applyAllRules'メッセージ送信ロジックの集約**
   - `IChromeTabsService`に`sendApplyAllRulesMessage(tab: Tab): Promise<any>`メソッドを追加
   - `ChromeTabsService`に実装を追加
   - 既存の3箇所を新しいメソッドに置き換え

2. **テストファイルの分割**
   - `registerTabsOnUpdated.test.ts`を1ファイル1describeの原則に従って分割
   - 最終的に`registerTabsOnUpdated/`ディレクトリ内のすべてのテストファイルが削除された

3. **テストコードの修正**
   - 関連テストファイルを新しいメソッドに対応

## 修正したファイル
- src/application/ports/IChromeTabsService.ts
- src/infrastructure/browser/tabs/ChromeTabsService.ts
- src/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase.ts
- src/infrastructure/browser/listeners/tabs.onUpdated.ts
- src/infrastructure/browser/router/messageHandlers.ts
- tests/unit/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase/execute/normal-cases.test.ts
- tests/unit/infrastructure/browser/router/handlers/applyAllRules.test.ts
- tests/unit/infrastructure/browser/listeners/registerTabsOnUpdated/ ディレクトリ内のすべてのファイルが削除された
