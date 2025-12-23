# user-story-001 結合テスト戦略

## 目的

ルールの有効/無効切り替え機能において、入力値（ruleId）からController → UseCase → Repository → DB → Presenterまでの一連のフローが正しく連携し、DBデータの整合性が保たれることを検証する。

## テストスコープ

### 対象レイヤー

```
入力: ruleId
  ↓
ToggleRuleActiveController.toggleActive(ruleId)
  ↓
ToggleRuleActiveInteractor.execute(inputData)
  ├→ DexieRewriteRuleRepository.getById(ruleId)
  ├→ RewriteRule.withActive(!isActive)
  ├→ DexieRewriteRuleRepository.update(toggledRule)
  ├→ [ITabsGateway.reloadMatchingTabs() - モック]
  └→ ToggleRuleActivePresenter.present(outputData)
       ↓
出力: updateRuleInView(toggledRule)
```

### 実コンポーネント（モックしない）

| レイヤー | コンポーネント | 理由 |
|---------|---------------|------|
| Interface Adapters | ToggleRuleActiveController | 入力変換の整合性検証 |
| Application | ToggleRuleActiveInteractor | ビジネスロジックの連携検証 |
| Application | ToggleRuleActiveInputData | DTOの構築検証 |
| Application | ToggleRuleActiveOutputData | DTOの出力検証 |
| Infrastructure | DexieRewriteRuleRepository | DB操作の実検証 |
| Infrastructure | IndexedDB (fake-indexeddb) | データ永続化の検証 |
| Enterprise | RewriteRule | ドメインロジック検証 |
| Interface Adapters | ToggleRuleActivePresenter | 出力変換の検証 |

### モック対象

| コンポーネント | 理由 |
|---------------|------|
| ITabsGateway | Chrome Tabs APIに依存するため |

## テスト分類

### 1. 正常系 - 状態切り替え

ルールのisActive状態が正しく反転し、DBに保存されることを検証する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| true → false | isActive=true のルールを false に切り替え | 基本パターン（有効→無効） |
| false → true | isActive=false のルールを true に切り替え | 基本パターン（無効→有効） |

**対応テスト**: `normal-cases.test.ts`

### 2. データ整合性 - DB永続化

Controller → DB までのデータフローが整合していることを検証する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| ID整合性 | 入力ruleIdと保存されたルールのIDが一致 | データの同一性担保 |
| isActive以外不変 | 他プロパティ（oldString, newString等）が変更されない | 副作用の排除 |
| 複数ルール独立 | 他のルールが影響を受けない | データ独立性 |

**対応テスト**: `data-integrity.test.ts`

### 3. 出力整合性 - Presenter経由のコールバック

Presenterを通じてView層に正しいデータが渡されることを検証する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| コールバック呼び出し | updateRuleInViewが呼び出される | View更新の保証 |
| 出力データ整合性 | コールバックに渡されるルールが更新後の状態 | UI表示の正確性 |

**対応テスト**: `presenter-output.test.ts`

### 4. エラー系 - ルール不存在

存在しないルールIDを指定した場合のエラーハンドリングを検証する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 存在しないID | 存在しないruleIdでエラーコールバックが呼ばれる | エラーの正しい伝播 |
| DBへの書き込みなし | エラー時にDBが変更されない | トランザクション的振る舞い |

**対応テスト**: `error-cases.test.ts`

## 網羅性チェック

- [x] 全入力パターン（true→false, false→true）
- [x] DB永続化の検証
- [x] 出力コールバックの検証
- [x] エラーケース（存在しないID）
- [x] 副作用の範囲（他プロパティ、他ルール不変）
- [ ] 同時実行 → 不要（単一操作のため）
- [ ] 境界値 → 不要（ruleIdは存在判定のみ）

## テストファイル構成

```
tests/integration/user-story-001/toggle-rule-active/
├── setup.ts                    # 共通セットアップ（fake-indexeddb等）
├── mocks/
│   └── createMockTabsGateway.ts  # TabsGatewayモック
├── helpers/
│   └── createTestRule.ts         # テストデータ生成ヘルパー
├── normal-cases.test.ts        # 正常系テスト
├── data-integrity.test.ts      # データ整合性テスト
├── presenter-output.test.ts    # Presenter出力テスト
└── error-cases.test.ts         # エラー系テスト
```

## モック戦略

### モック対象

- **ITabsGateway**: Chrome Tabs API（`chrome.tabs.query`, `chrome.tabs.reload`）に依存するため、テスト環境では動作不可

### モックの実装方針

TabsGatewayは `reloadMatchingTabs` メソッドのみをモック化し、呼び出し回数と引数を検証する。

### モックファイル構成

```
tests/integration/user-story-001/toggle-rule-active/
└── mocks/
    └── createMockTabsGateway.ts    # ITabsGateway モックファクトリ
```

## テストデータ設計

### 初期データ

```typescript
// isActive=true のルール
const activeRule = new RewriteRule(
  1,                      // id（DB自動採番）
  'oldString',            // oldString
  'newString',            // newString
  'https://example.com',  // urlPattern
  false,                  // isRegex
  true                    // isActive
);

// isActive=false のルール
const inactiveRule = new RewriteRule(
  2,                      // id（DB自動採番）
  'pattern',              // oldString
  'replacement',          // newString
  'https://test.com',     // urlPattern
  false,                  // isRegex
  false                   // isActive
);
```

### 期待結果

| 入力 | 操作後のisActive | DB状態 | コールバック引数 |
|------|------------------|--------|-----------------|
| activeRule (true) | false | isActive=false で保存 | toggledRule.isActive=false |
| inactiveRule (false) | true | isActive=true で保存 | toggledRule.isActive=true |

## 実行環境

- **DBモック**: fake-indexeddb（IndexedDBのインメモリ実装）
- **ブラウザAPI**: @webext-core/fake-browser
- **テストフレームワーク**: Vitest

## 依存関係図

```
┌─────────────────────────────────────────────────────────────┐
│                    テストコード                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. DBにテストデータ挿入                                 │   │
│  │ 2. Controller.toggleActive(ruleId) 呼び出し           │   │
│  │ 3. コールバック結果を検証                               │   │
│  │ 4. DBの状態を検証                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  結合対象コンポーネント                       │
│                                                             │
│  ToggleRuleActiveController                                 │
│         │                                                   │
│         ▼                                                   │
│  ToggleRuleActiveInteractor                                 │
│         │                                                   │
│    ┌────┴────┬────────────┬──────────────┐                 │
│    ▼         ▼            ▼              ▼                 │
│ Repository  Entity   TabsGateway    Presenter              │
│ (実DB)     (実物)    (モック)       (実物)                  │
│    │                     │              │                   │
│    ▼                     │              ▼                   │
│ IndexedDB                │         コールバック              │
│ (fake)                   │              │                   │
│                          │              │                   │
└──────────────────────────┼──────────────┼───────────────────┘
                           │              │
                           ▼              ▼
                     呼び出し検証     結果検証
```
