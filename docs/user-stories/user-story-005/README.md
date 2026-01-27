# User Story 005: テストデータ作成のファクトリーメソッド活用への統一

## ストーリー

> テストコードの可読性向上のため、テストデータ作成をファクトリーメソッド活用パターンに統一する

## 概要

[basic-rule.md](../../coding-standards/tests/unit/common-rule/basic-rule.md) の「テストデータ作成時のファクトリーメソッド活用」規約に準拠していない既存テストコードを更新する。

## 対象ファイル

> **Note**: 本ドキュメントのファイルパスは `host-frontend-root/frontend-src-root/` を基準とした相対パスで記載しています。

### 対象外（除外理由）

以下のファイルは修正対象から除外する：

1. **ファクトリ実装ファイル（ファクトリ内部で`new RewriteRule()`を使用するのは適切）**
   - `tests/integration/toggle-rule-active/helpers/createTestRule.ts`
   - `tests/unit/components/molecules/RuleTableRow/mocks/createMockRewriteRule.ts`

2. **コンストラクタテスト（コンストラクタ自体の動作をテストするため直接呼び出しが必要）**
   - `tests/unit/domain/entities/RewriteRule/constructor/normal-cases.test.ts`

### 修正対象ファイル一覧（41ファイル）

#### 1. interface-adapters層（3ファイル）

| # | ファイルパス | 状態 |
|---|-------------|------|
| 1 | `tests/unit/interface-adapters/factories/DeleteRuleControllerFactory/create/normal-cases.test.ts` | ⬜ 未着手 |
| 2 | `tests/unit/interface-adapters/presenters/ToggleRuleActivePresenter/present/normal-cases.test.ts` | ⬜ 未着手 |
| 3 | `tests/unit/interface-adapters/mappers/RewriteRuleMapper/toDto/normal-cases.test.ts` | ⬜ 未着手 |

#### 2. application-business-rules層（7ファイル）

| # | ファイルパス | 状態 |
|---|-------------|------|
| 4 | `tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/execute/normal-cases.test.ts` | ⬜ 未着手 |
| 5 | `tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/execute/error-cases.test.ts` | ⬜ 未着手 |
| 6 | `tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/execute/partial-success-cases.test.ts` | ⬜ 未着手 |
| 7 | `tests/unit/application-business-rules/interactors/DeleteRuleInteractor/execute/normal-cases.test.ts` | ⬜ 未着手 |
| 8 | `tests/unit/application-business-rules/interactors/DeleteRuleInteractor/execute/error-cases.test.ts` | ⬜ 未着手 |
| 9 | `tests/unit/application-business-rules/interactors/DeleteRuleInteractor/execute/partial-success-cases.test.ts` | ⬜ 未着手 |
| 10 | `tests/unit/application-business-rules/dto/output/ToggleRuleActiveOutputData/constructor/normal-cases.test.ts` | ⬜ 未着手 |

#### 3. application層（2ファイル）

| # | ファイルパス | 状態 |
|---|-------------|------|
| 11 | `tests/unit/application/usecases/rule/LoadRewriteRuleForEditUseCase/execute/normal-cases.test.ts` | ⬜ 未着手 |
| 12 | `tests/unit/application/usecases/rule/UpdateRewriteRuleUseCase/execute/normal-cases.test.ts` | ⬜ 未着手 |

#### 4. enterprise-business-rules層（5ファイル）

| # | ファイルパス | 状態 |
|---|-------------|------|
| 13 | `tests/unit/enterprise-business-rules/entities/RewriteRule/matchesUrl/normal-cases-false.test.ts` | ⬜ 未着手 |
| 14 | `tests/unit/enterprise-business-rules/entities/RewriteRule/matchesUrl/normal-cases-true.test.ts` | ⬜ 未着手 |
| 15 | `tests/unit/enterprise-business-rules/entities/RewriteRule/withActive/normal-cases.test.ts` | ⬜ 未着手 |
| 16 | `tests/unit/enterprise-business-rules/entities/RewriteRule/withActive/immutability.test.ts` | ⬜ 未着手 |
| 17 | `tests/unit/enterprise-business-rules/entities/RewriteRule/withActive/property-preservation.test.ts` | ⬜ 未着手 |

#### 5. domain層（17ファイル）

| # | ファイルパス | 状態 |
|---|-------------|------|
| 18 | `tests/unit/domain/value-objects/Tab/matchesRule/normal-cases.test.ts` | ⬜ 未着手 |
| 19 | `tests/unit/domain/value-objects/Tabs/filterByRule/normal-cases.test.ts` | ⬜ 未着手 |
| 20 | `tests/unit/domain/value-objects/RewriteRules/applyRulesWithDomDiffer/normal-cases.test.ts` | ⬜ 未着手 |
| 21 | `tests/unit/domain/value-objects/RewriteRules/toArray/normal-cases.test.ts` | ⬜ 未着手 |
| 22 | `tests/unit/domain/value-objects/RewriteRules/constructor/normal-cases.test.ts` | ⬜ 未着手 |
| 23 | `tests/unit/domain/entities/DomDiffer/basic-replacement.test.ts` | ⬜ 未着手 |
| 24 | `tests/unit/domain/entities/DomDiffer/normal-replacement.test.ts` | ⬜ 未着手 |
| 25 | `tests/unit/domain/entities/DomDiffer/regex-replacement.test.ts` | ⬜ 未着手 |
| 26 | `tests/unit/domain/entities/DomDiffer/regex-capture-group.test.ts` | ⬜ 未着手 |
| 27 | `tests/unit/domain/entities/DomDiffer/simple-element-replacement.test.ts` | ⬜ 未着手 |
| 28 | `tests/unit/domain/entities/DomDiffer/string-pattern-replacement.test.ts` | ⬜ 未着手 |
| 29 | `tests/unit/domain/entities/RewriteRule/addHtmlWhitespaceIgnoringPattern/reflection-tests.test.ts` | ⬜ 未着手 |
| 30 | `tests/unit/domain/entities/RewriteRule/createRedundantPattern/regex-pattern.test.ts` | ⬜ 未着手 |
| 31 | `tests/unit/domain/entities/RewriteRule/createRedundantPattern/string-pattern.test.ts` | ⬜ 未着手 |
| 32 | `tests/unit/domain/entities/ElementMatchesFlexiblePattern/exec/exact-pattern-matching.test.ts` | ⬜ 未着手 |
| 33 | `tests/unit/domain/entities/ElementMatchesFlexiblePattern/exec/regex-pattern-matching.test.ts` | ⬜ 未着手 |
| 34 | `tests/unit/domain/entities/ElementMatchesFlexiblePattern/exec/Abend/error-handling.test.ts` | ⬜ 未着手 |

#### 6. frameworks-and-drivers層（7ファイル）

| # | ファイルパス | 状態 |
|---|-------------|------|
| 35 | `tests/unit/frameworks-and-drivers/persistence/DexieRewriteRuleRepository/getRulesMatchingUrl/normal-cases.test.ts` | ⬜ 未着手 |
| 36 | `tests/unit/frameworks-and-drivers/persistence/DexieRewriteRuleRepository/getAll/normal-cases.test.ts` | ⬜ 未着手 |
| 37 | `tests/unit/frameworks-and-drivers/persistence/DexieRewriteRuleRepository/create/normal-cases.test.ts` | ⬜ 未着手 |
| 38 | `tests/unit/frameworks-and-drivers/persistence/DexieRewriteRuleRepository/create/Abend/error-cases.test.ts` | ⬜ 未着手 |
| 39 | `tests/unit/frameworks-and-drivers/persistence/DexieRewriteRuleRepository/update/normal-cases.test.ts` | ⬜ 未着手 |
| 40 | `tests/unit/frameworks-and-drivers/persistence/DexieRewriteRuleRepository/getById/normal-cases.test.ts` | ⬜ 未着手 |
| 41 | `tests/unit/frameworks-and-drivers/persistence/DexieRewriteRuleRepository/getById/error-cases.test.ts` | ⬜ 未着手 |

## タスク

### フェーズ1: 準備（1タスク）

| # | タスク | 説明 | 状態 |
|---|--------|------|------|
| T-1 | 共通ファクトリの確認・整備 | `RewriteRule.fromParams()` の使用方法を確認し、テストで使用可能か検証する | ⬜ 未着手 |

### フェーズ2: 層別リファクタリング（6タスク）

各タスクでは以下の作業を行う：
1. `new RewriteRule(...)` を `RewriteRule.fromParams(id, {...})` に置換
2. `RewriteRule.fromParams` に渡す `params` オブジェクトでは、`RewriteRuleParams` 型に従い `isRegex` を必ず明示する（元コードで `isRegex` が省略されていた箇所は `isRegex: false` など、元の挙動に対応する値を指定する）
3. `RewriteRuleParams` の `isActive` はデフォルトで `true` となるため、元コードで `new RewriteRule(..., ..., isActive=false)` のように `isActive` が明示されている場合は、`params` オブジェクトにも同じ値（例: `isActive: false`）を必ず指定する
4. テストが正常にパスすることを確認

| # | タスク | 対象ファイル数 | 状態 |
|---|--------|---------------|------|
| T-2 | interface-adapters層の修正 | 3ファイル | ⬜ 未着手 |
| T-3 | application-business-rules層の修正 | 7ファイル | ⬜ 未着手 |
| T-4 | application層の修正 | 2ファイル | ⬜ 未着手 |
| T-5 | enterprise-business-rules層の修正 | 5ファイル | ⬜ 未着手 |
| T-6 | domain層の修正 | 17ファイル | ⬜ 未着手 |
| T-7 | frameworks-and-drivers層の修正 | 7ファイル | ⬜ 未着手 |

### フェーズ3: 検証（1タスク）

| # | タスク | 説明 | 状態 |
|---|--------|------|------|
| T-8 | 全体テスト実行・確認 | `make testlint` を実行し、すべてのテストがパスすることを確認 | ⬜ 未着手 |

## 受け入れ条件

> **スコープ**: 以下の受け入れ条件は、本ドキュメントで列挙した「修正対象ファイル一覧（41ファイル）」に対してのみ適用されます。プロダクションコード（`src/` 配下）は対象外です。

1. **修正対象ファイル内のすべての`new RewriteRule(...)`がファクトリーメソッドによる生成に置換されていること**
   - 対象ファイル内では、位置引数による直接コンストラクタ呼び出し（`new RewriteRule(...)`）が引数の数にかかわらず存在しないこと
   - `RewriteRule.fromParams()` の第2引数オブジェクトの名前付きプロパティにより、各引数の意図が明確になっていること

2. **除外対象ファイル（ファクトリ実装・コンストラクタテスト）は変更しないこと**
   - これらのファイルでは`new RewriteRule(...)`の直接使用が許容される

3. **すべてのテストがパスすること**
   - `make testlint` が正常に完了する
   - 既存のテストの動作が変わっていない

4. **コード品質が維持されていること**
   - ESLintエラーがない
   - 未使用コードがない

## 修正例

### Before（禁止）
```typescript
const rule = new RewriteRule(1, 'old', 'new', 'https://example.com', false, true);
// 5番目がisRegex、6番目がisActiveだが、コードからは判別困難
```

### After（許可）
```typescript
const rule = RewriteRule.fromParams(1, {
  oldString: 'old',
  newString: 'new',
  urlPattern: 'https://example.com',
  isRegex: false,
  isActive: true,
});
// 各引数の意図が明確
```

## 備考

- 本タスクは [basic-rule.md](../../coding-standards/tests/unit/common-rule/basic-rule.md) の「テストデータ作成時のファクトリーメソッド活用」規約への準拠を目的とする
- 修正対象は `new RewriteRule()` の直接呼び出しのみであり、他のエンティティは対象外
- 層ごとに分割してタスクを進めることで、レビュー負荷を軽減する
