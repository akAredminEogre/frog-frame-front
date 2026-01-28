# tests/ ディレクトリ レビューガイドライン

テストコードの変更時は以下を確認してください：

## 確認項目

- 対応するdocs/design/内のテスト戦略書と整合性があるか
- テストファイルの構成がテスト戦略書の定義と一致しているか
- docs/coding-standards/tests/ のテストコード規約が守られているか

## インポートパスのルール

**重要**: テストコードでは `tests/*` 起点の絶対パスが許可されています。

### 許可されるパス

```typescript
// ✅ 正しい - tests/起点
import { expect, test } from 'tests/e2e/fixtures';
import { clearAllRules } from 'tests/e2e/helpers';

// ✅ 正しい - src/起点（srcのコードをインポートする場合）
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
```

### 禁止されるパス

```typescript
// ❌ 相対パス
import { helper } from '../helpers';
import { helper } from './helpers';
```

詳細は `docs/coding-standards/tests/common-rule/` を参照してください。
