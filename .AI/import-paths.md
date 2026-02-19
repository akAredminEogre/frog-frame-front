# Import Path Rules

**CRITICAL**: All imports MUST use absolute paths starting from `src`:

```typescript
// ✅ Correct
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';

// ❌ Wrong
import { RewriteRule } from '../domain/entities/RewriteRule/RewriteRule';
import { RewriteRule } from '@/domain/entities/RewriteRule/RewriteRule';
```

Path aliases configured in `tsconfig.json`:
- `src/*` → `./src/*`
- `tests/*` → `./tests/*`
- `entrypoints/*` → `./src/entrypoints/*`

詳細は `docs/coding-standards/tests/common-rule/import-paths.md` を参照。
