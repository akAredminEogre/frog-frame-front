# PR-001: Expand（スケルトン追加）

## 概要

空のクラス・コンポーネントを追加する。既存コードへの影響はゼロ。

## フェーズ

**Expand** - Parallel Changeパターンの第1フェーズ

## リスク

**極低** - 新規ファイル追加のみ、既存機能に影響なし

## 前提PR

なし

## 対象ファイル

### enterprise-business-rules/ (第1層)

| ファイル | 変更種別 | 内容 | 状態 |
|---------|---------|------|------|
| `src/enterprise-business-rules/RewriteRule/RewriteRule.ts` | 修正 | `withActive()` メソッド追加 | ⬜ |

### application-business-rules/ (第2層)

| ファイル | 変更種別 | 内容 | 状態 |
|---------|---------|------|------|
| `src/application-business-rules/dto/input/rule/ToggleRuleActiveInputData.ts` | 新規 | 空クラス | ⬜ |
| `src/application-business-rules/dto/output/rule/ToggleRuleActiveOutputData.ts` | 新規 | 空クラス | ⬜ |
| `src/application-business-rules/ports/input/rule/IToggleRuleActiveUseCase.ts` | 新規 | Interface定義 | ⬜ |
| `src/application-business-rules/ports/output/rule/IToggleRuleActivePresenter.ts` | 新規 | Interface定義 | ⬜ |
| `src/application-business-rules/interactors/rule/ToggleRuleActiveInteractor.ts` | 新規 | `throw new Error('Not implemented')` | ⬜ |

### interface-adapters/ (第3層)

| ファイル | 変更種別 | 内容 | 状態 |
|---------|---------|------|------|
| `src/interface-adapters/controllers/rule/ToggleRuleActiveController.ts` | 新規 | `throw new Error('Not implemented')` | ⬜ |
| `src/interface-adapters/presenters/rule/ToggleRuleActivePresenter.ts` | 新規 | `throw new Error('Not implemented')` | ⬜ |
| `src/interface-adapters/gateways/IRewriteRuleRepository.ts` | 新規 | Interface（既存からの移動） | ⬜ |

### frameworks-and-drivers/ (第4層)

| ファイル | 変更種別 | 内容 | 状態 |
|---------|---------|------|------|
| `src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.tsx` | 新規 | `return null;` | ⬜ |
| `src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.module.css` | 新規 | 空ファイル | ⬜ |
| `src/frameworks-and-drivers/ui/components/molecules/RulePreviewToggle.tsx` | 新規 | `return null;` | ⬜ |
| `src/frameworks-and-drivers/ui/components/molecules/RulePreviewToggle.module.css` | 新規 | 空ファイル | ⬜ |

## スケルトン実装例

### ToggleRuleActiveInputData.ts

```typescript
export class ToggleRuleActiveInputData {
  constructor(
    public readonly ruleId: number
  ) {}
}
```

### ToggleRuleActiveInteractor.ts

```typescript
import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/rule/IToggleRuleActiveUseCase';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/rule/IToggleRuleActivePresenter';
import { IRewriteRuleRepository } from 'src/interface-adapters/gateways/IRewriteRuleRepository';
import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/rule/ToggleRuleActiveInputData';

export class ToggleRuleActiveInteractor implements IToggleRuleActiveUseCase {
  constructor(
    private readonly rewriteRuleRepository: IRewriteRuleRepository,
    private readonly presenter: IToggleRuleActivePresenter
  ) {}

  async execute(inputData: ToggleRuleActiveInputData): Promise<void> {
    throw new Error('ToggleRuleActiveInteractor is not implemented yet');
  }
}
```

### ToggleSwitch.tsx

```typescript
import * as React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = () => {
  return null;
};
```

## 完了条件

- [ ] 全ファイルが作成されている
- [ ] TypeScriptコンパイルエラーがない
- [ ] `make testlint` がパスする
- [ ] 既存のテストが全てパスする
- [ ] PRがマージされている

## 次のPR

[PR-002: Migrate（実装を埋める）](./pr-002-migrate.md)
