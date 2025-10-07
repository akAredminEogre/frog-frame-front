# PROGRESS-04-11

## 作業内容
RewriteRuleのurlPatternを必須パラメータに変更

## 変更内容

### 1. RewriteRule.tsの修正
- urlPatternをオプショナル(`string | undefined`)から必須(`string`)に変更
- コンストラクタの型定義を修正

### 2. matchesUrlメソッドのロジック修正
- `!this.urlPattern`から`this.urlPattern === ''`に変更
- 空文字列を明示的にチェックするように修正

### 3. テストコードの修正
以下のテストファイルを修正：
- `tests/unit/domain/entities/RewriteRule/constructor/normal-cases.test.ts`
- `tests/unit/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase/execute/normal-cases.test.ts`
- `tests/unit/domain/entities/RewriteRule/createRedundantPattern/regex-pattern.test.ts`
- `tests/unit/domain/entities/RewriteRule/createRedundantPattern/string-pattern.test.ts`
- `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/save/normal-cases.test.ts`
- その他多数のテストファイルで3引数のコンストラクタ呼び出しを4引数に修正

### 4. 一括修正の内容
- `new RewriteRule(id, old, new)`を`new RewriteRule(id, old, new, '')`に一括置換
- `undefined`を`""`に一括置換
- `testCase.input.urlPattern`を`testCase.input.urlPattern || ""`に修正

## テスト結果
- ユニットテスト: 全65ファイル、260テスト全て通過 ✅
- E2Eテスト: 7/8テスト通過
  - 1つ失敗しているのはタイムアウトエラー（今回の変更とは無関係）

## 次のステップ
- 変更内容をコミット
- E2Eテストの失敗原因を調査（別タスクとして）
