# createRuleId() テスト戦略

## 目的

値オブジェクト `RuleId`（`Opaque<number, 'RuleId'>`）のスマートコンストラクタ。
`unknown` 型の入力を検証し、「**0 以上の整数**」のみを `RuleId` として返し、それ以外は `Error('Invalid RuleId: <raw>')` をスローする。

**責務範囲**:
- 入力が `number` 型であること
- `Number.isInteger` が真であること
- 値が 0 以上であること（`raw < 0` を拒否）

これにより、`RuleId` を受け取る上流レイヤー（Interactor / UseCase / Repository）では型レベルで整数性・非負性を保証できる。

## テスト分類

### 1. 正常系（同値分割：0 と正の整数）

`RuleId` の定義域（0 以上の整数）で代表値を網羅する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 正の整数（代表値） | `createRuleId(42)` → `42` | 一般的な有効値。数値がそのまま `RuleId` として返ることを検証 |
| 境界値（下限） | `createRuleId(0)` → `0` | `raw < 0` 判定の等号側境界。`0` は有効・falsy値であるため専用ケースが必要 |

**対応テスト**: `createRuleId.test.ts`（describe `createRuleId` 内の `it('正の整数を正常に生成できる')`, `it('0を正常に生成できる')`）

### 2. 異常系（境界値・同値分割：負数）

`raw < 0` 条件を発火させる代表値をテストする。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 境界値（下限を下回る） | `createRuleId(-1)` → `throw 'Invalid RuleId: -1'` | 負数拒否。`0` との境界直下を選択することで比較演算子（`<` vs `<=`）のオフバイワン誤りを検出可能 |

**対応テスト**: `createRuleId.test.ts`（`it('負数を拒否する')`）

### 3. 異常系（型チェック：non-number）

`RuleId.ts` は `typeof raw !== 'number'` を最初のゲートとしている。`unknown` 入力に対する型判定の網羅。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 文字列 | `createRuleId('abc')` → `throw 'Invalid RuleId: abc'` | 典型的な誤代入。JSONインポート等で数値文字列が混入するユースケースに対するガード |
| `null` | `createRuleId(null)` → `throw 'Invalid RuleId: null'` | 欠損値。`typeof null === 'object'` のJavaScript仕様に対する明示的拒否 |
| `undefined` | `createRuleId(undefined)` → `throw 'Invalid RuleId: undefined'` | 未定義入力。オプショナルプロパティ経由での混入に対するガード |

**対応テスト**: `createRuleId.test.ts`（`it('non-numberを拒否する')` に3 `expect` を配列/連結せずインライン記述）

### 4. 異常系（Number.isInteger違反：小数・NaN・Infinity）

`RuleId.ts:6` の `!Number.isInteger(raw)` 条件を発火させる代表値をテストする。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 小数 | `createRuleId(1.5)` → `throw 'Invalid RuleId: 1.5'` | `Number.isInteger(1.5) === false`。型は `number` だが整数性違反を単体検証 |
| `NaN` | `createRuleId(NaN)` → `throw 'Invalid RuleId: NaN'` | `Number.isInteger(NaN) === false`。数値演算失敗値の拒否を明示 |
| `Infinity` | `createRuleId(Infinity)` → `throw 'Invalid RuleId: Infinity'` | `Number.isInteger(Infinity) === false`。無限大の拒否を明示 |

**対応テスト**: `createRuleId.test.ts`（`it('小数（Number.isInteger違反）を拒否する')`, `it('NaNを拒否する')`, `it('Infinityを拒否する')`）

## 網羅性チェック

- [x] 正の整数で成功（代表値）
- [x] `0` で成功（境界値・下限）
- [x] 負数で失敗（境界値・下限の直下）
- [x] 文字列で失敗（型違反：非プリミティブ数値でない代表）
- [x] `null` で失敗（型違反：`typeof` が `'object'` となる仕様）
- [x] `undefined` で失敗（型違反：未定義）
- [x] エラーメッセージが仕様通り（`Invalid RuleId: <raw>` 形式）であること
- [x] `Number.isInteger` 違反（小数 `1.5` 等） → `createRuleId(1.5)` → `throw 'Invalid RuleId: 1.5'`
  - **根拠**: `RuleId.ts:6` の `!Number.isInteger(raw)` 条件を単体検証。PR#394 レビュー対応で追加済み
- [x] `NaN` / `Infinity` での挙動 → `createRuleId(NaN)` → `throw 'Invalid RuleId: NaN'`, `createRuleId(Infinity)` → `throw 'Invalid RuleId: Infinity'`
  - **根拠**: `Number.isInteger(NaN) === false`, `Number.isInteger(Infinity) === false` により拒否されることをテストで検証済み（PR#394 レビュー対応で追加）
- [ ] 型レベルの `Opaque` 検証（別の `Id` 型に代入できないこと） → 不要（TypeScript コンパイル時検証で保証され、ランタイムテストの対象外）
- [ ] 可変性 → 不要（プリミティブ `number` のため本質的にイミュータブル）

上記TODO 2項目は PR#394 レビュー対応の範囲内で対応済み（本PR内でテスト追加・ドキュメント更新完了）。

## テストファイル構成

```text
tests/unit/enterprise-business-rules/value-objects/ids/RuleId/
└── createRuleId.test.ts   # 正常系（2ケース）+ 異常系（負数1ケース + non-number 3ケース + Number.isInteger違反3ケース）
```

**ファイル配置の根拠**:
- `docs-rules/design/05-test-strategy.md:42-50` の「ディレクトリ構造原則」に準拠（`tests/unit/[layer]/[category]/[service-name]/[method-name]/` のミラー）
- 現PRでは `createRuleId` のみを対象とするため `Abend/` サブディレクトリへの異常系分離は省略（ケース数少数・ファイル分割不要）
- 配列ベーステストは未使用（各 `it` は独立した記述）

## モック戦略

**モックは使用しない**。

| 依存関係 | モック理由 | モック対応 |
|----------|-----------|-----------|
| なし（純粋関数） | - | 不要 |

### 根拠

- `createRuleId` は `unknown` → `RuleId` の純粋関数。外部依存・副作用なし
- `type-fest` の `Opaque` 型はコンパイル時のみ存在し、ランタイム挙動に影響しない
- `beforeEach` / `afterEach` のライフサイクル管理不要（現テストコードでも未定義で妥当）

## JSDocとの一貫性（§8 / §7 チェック）

現テストコード先頭 JSDoc:

```typescript
/**
 * createRuleId - バリデーションテスト
 * 1. 正の整数は正常に生成できる
 * 2. 0は正常に生成できる
 * 3. 負数は拒否される
 * 4. non-numberは拒否される
 * 5. 小数（Number.isInteger違反）は拒否される
 * 6. NaNは拒否される
 * 7. Infinityは拒否される
 */
```

| 観点 | 評価 |
|------|------|
| JSDoc 1行=1ケース | ✅ 遵守（`jsdoc-rule.md` §8.2） |
| JSDoc と `it()` 説明の一致 | ✅ 7ケースで厳密一致（`test-strategy-consistency.md` §7.1） |
| テスト戦略書の「テスト分類」との対応 | ✅ 本仕様書の分類 1〜4（7ケース）と順番・名前一致（§7.2） |
| 抽象表現の回避 | ✅ 「正の整数」「0」「負数」「non-number」「小数」「NaN」「Infinity」は具体的検証内容 |

## 機能要件トレーサビリティ

**本仕様書はユニットテスト戦略書**のため、結合テスト戦略書向けの機能要件トレーサビリティ表（`05-test-strategy.md:125-175`）は不要。
`RuleId` 値オブジェクトは型レベルの不変条件を表現するためのものであり、特定機能要件ドキュメントとの対応関係はない（Clean Architecture Enterprise Business Rules 層の原始型）。

## 関連ドキュメント

- 実装: `host-frontend-root/frontend-src-root/src/enterprise-business-rules/value-objects/ids/RuleId.ts`
- テスト: `host-frontend-root/frontend-src-root/tests/unit/enterprise-business-rules/value-objects/ids/RuleId/createRuleId.test.ts`
- 上位規約: `docs-rules/design/05-test-strategy.md`
- 分岐型規約: `docs/coding-standards/branded-types.md`（`Opaque` 利用全般）
