# テストコーディング規約(基本ルール)

- モック作成は、別のクラスファイルに切り出し、それをインポートして使用すること
- テストコード内で直接モックを定義しないこと

## eslint-rule

### モック作成の分離ルール

**ESLintルール化**: 不可

**理由**:
- `vi.fn()` の呼び出し自体は検出可能だが、それが「適切に別ファイルに切り出されている」かどうかは静的解析で判断困難
- 単純なコールバックスパイなど、正当なユースケースも禁止される
- 既存コードへの影響が大きい（18ファイルが違反）

**遵守方法**:
1. **コードレビューで確認**: PRレビュー時にモックの配置を確認
2. **mocks/ ディレクトリの利用**: テストディレクトリ内に `mocks/` サブディレクトリを作成し、モックファクトリを配置
3. **命名規則**: モックファクトリは `createMock[ClassName].ts` の形式で命名

**モックファクトリの配置例**:
```
tests/unit/[layer]/[category]/[ServiceName]/
├── [methodName]/
│   └── normal-cases.test.ts
└── mocks/
    └── createMockDependency.ts
```

# Clean Architecture用ルール

Clean Architectureの各層に特化したテスト規約です。

## 各層共通の規約

### テストファイル構造とディレクトリ構成

#### ディレクトリ構造の原則
```
tests/unit/[layer]/[category]/[service-name]/
├── [method-name]/
│   ├── normal-cases.test.ts         # 正常系テスト
│   └── Abend/                       # 異常系テスト専用ディレクトリ
│       └── error-cases.test.ts      # エラーケース
```
- **単体テストは、1メソッドごとに1ファイル以上にすること**
  - クラス単位でまとめない
  - 1メソッドでもあっても、ケースの内容や量によっては、適切に複数ファイルに分割すること

#### 異常系テストの分離原則
- `Abend/` ディレクトリに異常系テストを分離
- 外部システム依存の異常ケースを重点的にテスト
- 正常系と異常系の明確な区分
- 異常系内でもケース別にファイルを分割

### テストファイルごとの規則

- テストファイル1つにつき、配列化テストケースは1つまでとし、その他のテストケースは別ファイルに切り出すこと

## mocks/ ディレクトリ未配置モック一覧

以下のモックファクトリは `mocks/` ディレクトリに配置されておらず、規約に準拠していない。将来のリファクタリング対象として記録する。

| 現在のパス | 理論的配置 |
|-----------|-----------|
| `tests/unit/application/ports/IChromeTabsService/createMockTabsService.ts` | `tests/unit/application/ports/IChromeTabsService/mocks/` |
| `tests/unit/application/ports/ICurrentUrlService/createMockCurrentUrlService.ts` | `tests/unit/application/ports/ICurrentUrlService/mocks/` |
| `tests/unit/application/ports/IPopupService/createMockPopupService.ts` | `tests/unit/application/ports/IPopupService/mocks/` |
| `tests/unit/application/ports/ISelectedPageTextRepository/createMockSelectedPageTextRepository.ts` | `tests/unit/application/ports/ISelectedPageTextRepository/mocks/` |
| `tests/unit/domain/ports/IDomRootChecker/createMockDomRootChecker.ts` | `tests/unit/domain/ports/IDomRootChecker/mocks/` |
| `tests/unit/domain/ports/IElementFactory/createMockElementFactory.ts` | `tests/unit/domain/ports/IElementFactory/mocks/` |
| `tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway.ts` | `tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/` |

**注意**: 新規モック作成時は必ず `mocks/` ディレクトリに配置すること。

