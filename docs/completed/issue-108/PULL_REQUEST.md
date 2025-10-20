# ISSUE-108 PULL REQUEST

## タイトル
Fix: chrome://などの制限されたURLでのエラーログ出力を防止

## 概要と理由

### 問題
chrome://extensions/などの制限されたURLで拡張機能を使用すると、コンソールに以下のエラーログが出力される問題がありました:

```
ChromeTabsService.ts:43 [ChromeTabsService] sendApplyAllRulesMessage error: Error: Could not establish connection. Receiving end does not exist.
```

### 原因
- `tabs.onUpdated`リスナーが全てのタブに対して`sendApplyAllRulesMessage`を呼び出していた
- chrome://やabout://などのURLにはコンテンツスクリプトを注入できない（Chromeの仕様）
- 注入できないURLに対してメッセージ送信を試みるため、エラーログが出力されていた

### 解決策
メッセージ送信前にURLをフィルタリングし、コンテンツスクリプトが注入できないURLに対してはメッセージを送信しないように修正しました。

## 主な変更点

### 1. Domain層: TabUrl値オブジェクトの実装
- `src/domain/value-objects/TabUrl/TabUrl.ts`を新規作成
- URLの値を保持し、コンテンツスクリプト注入可否を判定するロジックを実装
- `canInjectContentScript()`メソッドで以下のURLをフィルタリング:
  - chrome://
  - about://
  - edge://
  - opera://
  - vivaldi://
  - brave://
- Clean Architectureの原則に従い、Domain層に純粋なビジネスロジックとして配置

### 2. Infrastructure層: tabs.onUpdatedリスナーの修正
- `src/infrastructure/browser/listeners/tabs.onUpdated.ts`を修正
- `TabUrl`を使用してURLフィルタリングを実装
- 注入可能なURLに対してのみメッセージを送信するように変更

### 3. テストの追加
- **ユニットテスト**: `TabUrl`の13テストケース（正常系・異常系・境界値）
- **E2Eテスト**: `restricted-url-handling.spec.ts`を新規作成
  - about:blankでエラーが発生しないことを確認
  - Chrome Web Storeでエラーが発生しないことを確認
  - 通常のHTTPページでルールが正常に適用されることを確認

## テスト方法
### 自動テスト
- `make test-and-check` で回帰テスト通過を確認
  - ユニットテスト: 293テスト合格（13テスト新規追加）
  - E2Eテスト: 12テスト合格（3テスト新規追加）
  - lint/knip/tsrの警告確認済み

### 手動テスト（実機確認）
開発者が実際のブラウザで以下を確認してください:
1. chrome://extensions/を開く
   - コンソールにエラーログが出力されないこと
2. 通常のウェブページを開く
   - ルールが正常に適用されること
3. Chrome Web Store (https://chrome.google.com/webstore/)を開く
   - コンソールにエラーログが出力されないこと

## 補足

### アーキテクチャ上の判断
- URLフィルタリングロジックをDomain層の値オブジェクトとして実装
- Infrastructure層のサービスやApplication層のUseCaseではなく、値オブジェクトに配置することで:
  - テスタビリティの向上
  - 責務の明確化
  - 再利用性の向上

### レビューフィードバック対応
DAILY-SCRUM 03で3回の進捗を通じて、コードレビューのフィードバックに対応:
1. 01回目: 基本的なE2Eテストの実装
2. 02回目: Chrome Web StoreのURLでのテストケース追加
3. 03回目: コンソールエラー検証のアサーションを明示的に追加

### 受け入れ条件の達成
- ✅ chrome://extensions/などのURLでエラーログが出力されないこと
- ✅ Chrome Web Storeなどの外部URLでエラーログが出力されないこと
- ✅ 通常のウェブページでは引き続き正常にルールが適用されること
- ✅ 既存のテストが全て合格すること

## 本スコープの対象外となったタスク

なし（PLAN.mdで計画したすべてのタスクを完了）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
