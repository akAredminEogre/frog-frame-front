# ISSUE-072 PULL REQUEST

## タイトル

feat: queryTabsメソッドの戻り値をTabsクラスに変更し、ファーストクラスコレクションを導入

## 概要と理由

`IChromeTabsService.queryTabs`メソッドの戻り値を`Promise<chrome.tabs.Tab[]>`から`Promise<Tabs>`に変更しました。

## 主な変更点

### 1. Tabsクラスの新規作成
- `src/domain/value-objects/Tabs.ts` (新規)
  - Tabのファーストクラスコレクション
  - `filterByRule(rule: RewriteRule): Tabs` - ルールにマッチするタブをフィルタリング
  - `toArray(): ReadonlyArray<Tab>` - タブの配列を取得
  - `ReadonlyArray`を使用してイミュータブルな設計を実現

### 2. Tab.matchesRuleメソッドの追加
- `src/domain/value-objects/Tab.ts`
  - `matchesRule(rule: RewriteRule): boolean` - ルールにマッチするかを判定
  - URL判定ロジックをTabクラスに集約

### 3. IChromeTabsServiceインターフェースの変更
- `src/application/ports/IChromeTabsService.ts`
  - `queryTabs`の戻り値を`Promise<chrome.tabs.Tab[]>`から`Promise<Tabs>`に変更

### 4. ChromeTabsServiceの実装変更
- `src/infrastructure/browser/tabs/ChromeTabsService.ts`
  - `queryTabs`メソッドの実装を更新
  - Tabインスタンスの配列からTabsインスタンスを生成して返すように修正

### 5. テストコードの作成
- `tests/unit/domain/value-objects/Tab/matchesRule/normal-cases.test.ts` (新規)
  - URLパターン完全一致のテスト
  - URLパターン前方一致のテスト
  - 異なるサブパスでfalseを返すテスト
  
- `tests/unit/domain/value-objects/Tabs/filterByRule/normal-cases.test.ts` (新規)
  - 全てのタブがマッチする場合のテスト
  - 一部のタブがマッチする場合のテスト
  - 1つもマッチしない場合のテスト
  - 空のTabsに対するフィルタリングのテスト

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test:all` で回帰テスト通過を確認

## 補足

- 今回の変更は、タブの扱いをよりドメインモデル指向にするための基盤作りです
- 将来的に、タブのコレクションに対する操作が増えた場合でも、Tabsクラスに集約することで保守性を保つことができます
- イミュータブルな設計により、並行処理時の安全性も向上しています

## 本スコープの対象外となったタスク

特になし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
