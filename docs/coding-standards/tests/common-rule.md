# テスト共通ルール

テストコード全般に適用される共通ルール。

---

## 1. インポートパスのルール

### 規約

- `tsconfig.json` で定義されているパスエイリアス（`src/*`, `tests/*`）を使用すること
- 相対パス（`../`, `./`）は使用しないこと
- 冗長なパス（`src/../tests/`）は使用しないこと

### 禁止事項

- `src/../tests/...` のような冗長パス
- `../helpers/...` のような相対パス
- `../../../src/...` のような深い相対パス

### 許可事項

- `tests/...` で始まるパス（testsディレクトリ内のファイル）
- `src/...` で始まるパス（srcディレクトリ内のファイル）

## eslint-rule

- srcディレクトリ: `eslint-rules/no-relative-paths.js`
- testsディレクトリ: `eslint-rules/tests/no-relative-paths-tests.js`

---

## 2. モックファイルの配置ルール

### 規約

- モックファイルは、モック対象クラスのsrcディレクトリ構造を `tests/` 配下で反映したディレクトリに配置すること
- モック対象クラスのパス: `src/{layer}/{category}/{ClassName}/`
- モックファイルのパス: `tests/{layer}/{category}/{ClassName}/`

### 配置例

| モック対象クラス | モックファイル配置先 |
|------------------|---------------------|
| `src/frameworks-and-drivers/browser/ChromeTabsGateway/` | `tests/frameworks-and-drivers/browser/ChromeTabsGateway/` |
| `src/infrastructure/persistence/indexeddb/` | `tests/infrastructure/persistence/indexeddb/` |
| `src/application-business-rules/ports/gateway/ITabsGateway.ts` | `tests/unit/application-business-rules/ports/gateway/ITabsGateway/mocks/` |

### 禁止事項

- テスト固有のディレクトリ（例: `tests/integration/{feature}/mocks/`）にモックを配置すること
- モック対象クラスのディレクトリ構造と異なる場所に配置すること
- **同一インターフェースのモックを複数箇所に作成すること**（重複モックの禁止）

### 許可事項

- 複数のテストから共有されるモックは、モック対象クラスに対応するtestsディレクトリに配置

### モック作成前の確認手順（必須）

新規モックファクトリ作成前に、以下を確認すること：

1. **既存モックの検索**
   ```bash
   # 同一インターフェースのモックを検索（例：ITabsGateway）
   grep -r "createMockTabsGateway" tests/
   # または
   find tests/ -name "createMock*.ts" | xargs grep -l "ITabsGateway"
   ```

2. **検索結果の判断**
   - 既存モックが見つかった場合 → **既存モックをインポートして使用**
   - 見つからなかった場合 → モック対象クラスのtestsディレクトリに新規作成

3. **共有モックの配置先**
   - ポート/インターフェースレベルのモック → `tests/unit/{layer}/ports/{category}/{InterfaceName}/mocks/`
   - 例：`ITabsGateway` → `tests/unit/application-business-rules/ports/gateway/ITabsGateway/mocks/`
   - 例：`IRewriteRuleRepository` → `tests/unit/application/ports/IRewriteRuleRepository/mocks/`

**重要**: この手順を省略すると、PRレビューで重複モックの指摘を受けます。

## eslint-rule

ESLint化不可（ディレクトリ構造の規約はファイルシステムレベルの検証が必要、PRレビューで確認）

---

## 3. テストデータの型注釈ルール

### 規約

- テストケース配列には明示的な型注釈を付けること
- 型注釈により、プロパティ名のタイポや型の不一致をコンパイル時に検出できる

### 禁止事項

- 型推論に頼ったテストデータ配列の定義

### 許可事項

- `Array<T>` または `T[]` 形式での型注釈
- 型エイリアス（`type` または `interface`）を定義しての型注釈

## eslint-rule

ESLint化不可（`@typescript-eslint/typedef`はすべての変数宣言に型注釈を要求するため過剰。テストデータ配列のみを対象とするルールは存在しない。PRレビューで確認）
