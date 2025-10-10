# ISSUE-073: sendApplyAllRulesMessageメソッドへの統一

## タイトル
メッセージ送信ロジックをChromeTabsService.sendApplyAllRulesMessageに統一

## 概要と理由

現在、`applyAllRules`メッセージの送信が複数箇所で直接`chrome.tabs.sendMessage`を使用して実装されており、コードの重複と保守性の低下を招いていました。

この問題を解決するため、メッセージ送信ロジックを`ChromeTabsService.sendApplyAllRulesMessage()`メソッドに集約しました。これにより、以下のメリットが得られます：

- コードの重複を削減
- メッセージ送信ロジックの一元管理
- 将来的な変更時の修正箇所の削減
- テスタビリティの向上

## 主な変更点

### 1. messageHandlers.tsの変更
- `chrome.tabs.sendMessage`の直接呼び出しを`ChromeTabsService.sendApplyAllRulesMessage()`に置き換え
- `Tab`値オブジェクトを使用してタブ情報をカプセル化

**変更前:**
```typescript
const response = await chromeTabsService.sendMessage(tabId, {
  type: 'applyAllRules',
  tabUrl
});
```

**変更後:**
```typescript
const tab = new Tab(tabId, tabUrl);
const response = await chromeTabsService.sendApplyAllRulesMessage(tab);
```

### 2. tabs.onUpdated.tsの変更
- `chrome.tabs.sendMessage`の直接呼び出しを`ChromeTabsService.sendApplyAllRulesMessage()`に置き換え
- すでに`Tab`値オブジェクト（`currentTab`）が存在するため、直接渡すように変更

**変更前:**
```typescript
chrome.tabs.sendMessage(tabId, {
  type: 'applyAllRules',
  tabUrl: currentTab.getTabUrl().value
}).catch(() => { /* コンテンツスクリプト未注入時のエラーは無視 */ });
```

**変更後:**
```typescript
chromeTabsService.sendApplyAllRulesMessage(currentTab).catch(() => { /* コンテンツスクリプト未注入時のエラーは無視 */ });
```

### 3. テストコードの更新
- `applyAllRules.test.ts`: `sendApplyAllRulesMessage`を使用するように更新
- `registerTabsOnUpdated.test.ts`: 削除（`sendApplyAllRulesMessage`のテストは`ChromeTabsService`のテストで実施するため）

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test:all` で回帰テスト通過を確認
  - ユニットテスト: 68ファイル、253テスト成功
  - E2Eテスト: 7テスト成功

## 補足
- `ChromeTabsService.sendApplyAllRulesMessage()`メソッドは既に別PRで実装済み
- この変更により、メッセージ送信ロジックの一元化が完了

## 本スコープの対象外となったタスク
- なし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
