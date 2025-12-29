# createRewriteRuleProxyServiceImpl().deleteRule() テスト戦略

## 目的

DIコンテナからIRewriteRuleRepositoryを解決し、指定されたIDのルールを削除する。
Background Script専用のProxy Service実装として、ルール削除リクエストをリポジトリに委譲する。

## テスト分類

### 1. 正常系（Repository削除委譲）

リポジトリのdeleteメソッドが正しく呼び出されることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 単一ID削除 | 指定IDでrepository.delete()が呼ばれる | 基本パターン（削除処理の委譲確認） |
| 異なるID | 別のIDでも正しく委譲される | 複数パターンの確認 |

**対応テスト**: `normal-cases.test.ts`

### 2. リポジトリ呼び出し確認

container.resolve()でリポジトリを取得し、delete()が1回呼ばれることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 呼び出し回数 | repository.delete()が1回呼ばれる | メソッド委譲の確認 |
| 引数確認 | 渡されたidがそのまま渡される | 引数の正確な伝播確認 |

**対応テスト**: `normal-cases.test.ts` 内で検証

## 網羅性チェック

- [x] 単一ID削除の委譲
- [x] repository.delete()が1回呼ばれること
- [x] 引数idが正しく渡されること
- [ ] 異常系（Repository例外） → 不要（エラーハンドリングなし、上位層で処理）
- [ ] 存在しないID → 不要（リポジトリ層で処理、ProxyServiceは単に委譲するのみ）

## テストファイル構成

```
tests/unit/frameworks-and-drivers/messaging/RewriteRuleProxyServiceImpl/
└── deleteRule/
    └── normal-cases.test.ts       # Repository削除委譲（2ケース）
```

## モック戦略

> **重要**: [basic-rule.md](../../../../../coding-standards/tests/unit/common-rule/basic-rule.md) の「モック作成の分離ルール」に従う。

### モック対象

- **container.resolve()**: DIコンテナからリポジトリを取得する部分をモック化
- **IRewriteRuleRepository**: delete()メソッドをモック設定

### モックファイル構成

```
tests/unit/frameworks-and-drivers/messaging/RewriteRuleProxyServiceImpl/
└── mocks/
    └── createMockRewriteRuleRepository.ts    # モックファクトリ
```

### モック方法

```typescript
import { createMockRewriteRuleRepository } from 'tests/unit/.../mocks/createMockRewriteRuleRepository';

// container.resolveのモック
vi.mock('src/frameworks-and-drivers/di/container', () => ({
  container: {
    resolve: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  const mockRepository = createMockRewriteRuleRepository();
  (container.resolve as ReturnType<typeof vi.fn>).mockReturnValue(mockRepository);
});
```

### モック対象の理由

- container.resolve: DIコンテナはtsyringeに依存し、実際のリポジトリ実装（DexieRewriteRuleRepository等）を返すため、単体テストではモック化が必須
- IRewriteRuleRepository: DB操作を伴うため、単体テストではモック化
