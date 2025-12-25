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

### 禁止事項

- テスト固有のディレクトリ（例: `tests/integration/{feature}/mocks/`）にモックを配置すること
- モック対象クラスのディレクトリ構造と異なる場所に配置すること

### 許可事項

- 複数のテストから共有されるモックは、モック対象クラスに対応するtestsディレクトリに配置

## eslint-rule

ESLint化不可（ディレクトリ構造の規約はファイルシステムレベルの検証が必要、PRレビューで確認）
