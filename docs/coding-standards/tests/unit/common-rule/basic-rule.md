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

---

## モックライフサイクル管理

### 規約

- `beforeEach` では `vi.clearAllMocks()` を使用する
- `afterEach` では `vi.resetAllMocks()` を使用する

### clearAllMocks vs resetAllMocks の違い

| 関数 | 呼び出し履歴 | モック実装 |
|------|-------------|-----------|
| `clearAllMocks()` | クリア | 維持 |
| `resetAllMocks()` | クリア | リセット |

### 理由

- `beforeEach` では呼び出し履歴のみクリアし、モック実装は維持する（各テストで同じモック実装を再利用）
- `afterEach` ではモック実装もリセットし、次のテストファイルへの影響を防ぐ

### eslint-rule

ESLint化不可（beforeEach/afterEach内での特定関数呼び出しを強制するルールは存在しない）

### 遵守方法

1. **コードレビュー時の確認**: PR作成時に以下を確認
   - `beforeEach`で`vi.clearAllMocks()`が使用されているか
   - `afterEach`で`vi.resetAllMocks()`が使用されているか
2. **既存テストファイルの参照**: 同プロジェクト内の既存テストファイルを参考にすること

---

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

### 冗長なアサーションの回避

#### 規約

- 「例外がスローされないこと」のテストには `.resolves.not.toThrow()` を使用しないこと
- async関数が正常終了すれば、テストフレームワークは成功と判定する
- 例外がスローされた場合、テストは自動的に失敗する

#### 禁止事項

```typescript
// ❌ 冗長 - .resolves.not.toThrow() は不要
await expect(repository.delete(id)).resolves.not.toThrow();
```

#### 許可事項

```typescript
// ✅ シンプル - 例外時は自動失敗
await repository.delete(id);

// Assert - 副作用で状態を検証
const remainingRules = await repository.getAll();
expect(remainingRules.toArray()).toHaveLength(1);
```

#### eslint-rule

**ESLintルール化**: 不可（PRレビューで確認）

### テストデータ作成時のファクトリーメソッド活用

#### 規約

- 位置引数が多いコンストラクタ（4つ以上）を直接呼び出さないこと
- ファクトリーメソッド（`fromParams()` 等）が提供されている場合は、それを使用すること
- 名前付きプロパティにより、各引数の意図が明確になる

#### 背景

位置引数が多いコンストラクタは、引数の順序を間違えやすく、コードレビューでも発見しにくい。
特にboolean型の引数が複数ある場合、`false, true` のような記述では意図が不明瞭になる。

#### 禁止事項

```typescript
// ❌ 位置引数では意図が不明瞭
const rule = new RewriteRule(1, 'old', 'new', 'https://example.com', false);
// 5番目の false は isRegex? isActive?

// ❌ 全引数を指定しても可読性が低い
const rule = new RewriteRule(1, 'old', 'new', 'https://example.com', false, true);
```

#### 許可事項

```typescript
// ✅ ファクトリーメソッドで意図を明確に
const rule = RewriteRule.fromParams(1, {
  oldString: 'old',
  newString: 'new',
  urlPattern: 'https://example.com',
  isRegex: false,
  isActive: true,
});
```

#### eslint-rule

**ESLintルール化**: 不可（PRレビューで確認）

#### 既存コードへの適用

規約に準拠していない既存テストコードは [user-story-005](../../../user-stories/user-story-005/README.md) で対応予定。

**注意**: 新規テスト作成時は必ずファクトリーメソッドを使用すること。

## mocks/ ディレクトリ未配置モック

規約に準拠していないモックファクトリは [user-story-004](../../../user-stories/user-story-004/README.md) で対応予定。

**注意**: 新規モック作成時は必ず `mocks/` ディレクトリに配置すること。

---

## Reactテストユーティリティのインポート

### 規約

`act`などのReactテストユーティリティは、適切なパッケージからインポートすること。

| ユーティリティ | インポート元 | 備考 |
|--------------|-------------|------|
| `act` | `react-dom/test-utils` | 本プロジェクトの標準 |

### 禁止事項

```typescript
// ❌ reactパッケージから直接インポートしない
import React, { act } from 'react';
```

### 許可事項

```typescript
// ✅ react-dom/test-utilsからインポート
import React from 'react';
import { act } from 'react-dom/test-utils';
```

### 補足

React 18.3.1以降では`act`が`react`パッケージから直接エクスポートされるようになったが、以下の理由で`react-dom/test-utils`からのインポートを標準とする：

- Reactの公式ドキュメントで長年推奨されてきたパターン
- 多くのリンターやツールが`react-dom/test-utils`を想定している
- コードベース全体での一貫性を維持

### eslint-rule

ESLint化不可（インポート元の正確性は静的解析で判断困難。PRレビューで確認）

---

## 共通テストユーティリティの配置

### 規約

複数のテストヘルパーで使用される汎用ユーティリティは、共通ファイルに配置すること。

- **配置場所**: `tests/unit/frameworks-and-drivers/ui/test-utils.ts`（UIコンポーネント用）
- **再エクスポート**: 各test-helpersファイルでは後方互換性のため再エクスポートする

### 背景

同一の実装が複数のtest-helpersファイルに重複すると、修正時に漏れが発生するリスクがある。

### 例

```typescript
// tests/unit/frameworks-and-drivers/ui/test-utils.ts（共通ユーティリティ）
export const flushPromises = (): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
};

// tests/unit/.../ComponentName/test-helpers.tsx（各コンポーネント用）
import { flushPromises } from 'tests/unit/frameworks-and-drivers/ui/test-utils';
export { flushPromises }; // 後方互換性のため再エクスポート
```

### eslint-rule

ESLint化不可（PRレビューで確認）

---

## flushPromisesはact()内で使用する

### 規約

`flushPromises`などの非同期更新待機処理は、`act()`の内部で実行すること。

### 理由

- `act()`外で非同期更新が完了すると、React警告が発生する可能性がある
- Reactの状態更新を確実に同期するため

### 禁止事項

```typescript
// ❌ act()の外でflushPromises
await act(async () => {
  root.render(<Component />);
});
await flushPromises();
```

### 許可事項

```typescript
// ✅ act()の中でflushPromises
await act(async () => {
  root.render(<Component />);
  await flushPromises();
});
```

### eslint-rule

ESLint化不可（PRレビューで確認）

