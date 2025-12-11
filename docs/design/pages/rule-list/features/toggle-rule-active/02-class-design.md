# クラス設計

## 制御フロー

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     frameworks-and-drivers/ (第4層)                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ui/pages/rules/RulesApp.tsx (View)                                 │ │
│  │     - ユーザー操作を受け取る                                         │ │
│  │     - Controllerを呼び出す                                          │ │
│  │     - Presenterからの更新を反映                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     interface-adapters/ (第3層)                          │
│  ┌──────────────────────────┐    ┌──────────────────────────┐          │
│  │ controllers/rule/        │    │ presenters/rule/         │          │
│  │ ToggleRuleActiveController│    │ ToggleRuleActivePresenter│          │
│  │                          │    │                          │          │
│  │ - ruleIdを受け取る        │    │ - OutputDataを受け取る    │          │
│  │ - InputDataに変換         │    │ - Viewの状態を更新        │          │
│  │ - UseCaseを呼び出す       │    │                          │          │
│  └────────────┬─────────────┘    └──────────▲───────────────┘          │
└───────────────┼──────────────────────────────┼──────────────────────────┘
                │ InputData                    │ OutputData
                ▼                              │
┌──────────────────────────────────────────────────────────────────────────┐
│                   application-business-rules/ (第2層)                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ interactors/rule/ToggleRuleActiveInteractor                      │   │
│  │                                                                  │   │
│  │ - InputDataからruleIdを取得                                       │   │
│  │ - Repositoryからルール取得                                         │   │
│  │ - isActiveを反転 (withActive)                                     │   │
│  │ - Repositoryで更新                                                │   │
│  │ - OutputDataを作成してPresenterに渡す                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    enterprise-business-rules/ (第1層)                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ entities/RewriteRule/RewriteRule.ts                               │   │
│  │                                                                  │   │
│  │ - withActive(isActive): 新しいインスタンスを返す                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## 各クラスの詳細

### 1. RewriteRule.withActive() [enterprise-business-rules]

```typescript
// src/enterprise-business-rules/entities/RewriteRule/RewriteRule.ts

/**
 * isActiveを変更した新しいインスタンスを返す（イミュータブル）
 * @param isActive 新しい有効/無効状態
 * @returns 新しいRewriteRuleインスタンス
 */
public withActive(isActive: boolean): RewriteRule {
  return new RewriteRule(
    this.id,
    this.oldString,
    this.newString,
    this.urlPattern,
    this.isRegex,
    isActive
  );
}
```

### 2. ToggleRuleActiveInputData [application-business-rules/dto]

```typescript
// src/application-business-rules/dto/input/rule/ToggleRuleActiveInputData.ts

export class ToggleRuleActiveInputData {
  constructor(
    public readonly ruleId: number
  ) {}
}
```

### 3. ToggleRuleActiveOutputData [application-business-rules/dto]

```typescript
// src/application-business-rules/dto/output/rule/ToggleRuleActiveOutputData.ts

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

export class ToggleRuleActiveOutputData {
  constructor(
    public readonly toggledRule: RewriteRule
  ) {}
}
```

### 4. IToggleRuleActiveUseCase [application-business-rules/ports/input]

```typescript
// src/application-business-rules/ports/input/rule/IToggleRuleActiveUseCase.ts

import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/rule/ToggleRuleActiveInputData';

export interface IToggleRuleActiveUseCase {
  execute(inputData: ToggleRuleActiveInputData): Promise<void>;
}
```

### 5. IToggleRuleActivePresenter [application-business-rules/ports/output]

```typescript
// src/application-business-rules/ports/output/rule/IToggleRuleActivePresenter.ts

import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/rule/ToggleRuleActiveOutputData';

export interface IToggleRuleActivePresenter {
  present(outputData: ToggleRuleActiveOutputData): void;
}
```

### 6. ToggleRuleActiveInteractor [application-business-rules/interactors]

```typescript
// src/application-business-rules/interactors/rule/ToggleRuleActiveInteractor.ts

import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/rule/IToggleRuleActiveUseCase';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/rule/IToggleRuleActivePresenter';
import { IRewriteRuleRepository } from 'src/interface-adapters/gateways/persistence/IRewriteRuleRepository';
import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/rule/ToggleRuleActiveInputData';
import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/rule/ToggleRuleActiveOutputData';

export class ToggleRuleActiveInteractor implements IToggleRuleActiveUseCase {
  constructor(
    private readonly rewriteRuleRepository: IRewriteRuleRepository,
    private readonly presenter: IToggleRuleActivePresenter
  ) {}

  async execute(inputData: ToggleRuleActiveInputData): Promise<void> {
    const currentRule = await this.rewriteRuleRepository.getById(inputData.ruleId);
    const toggledRule = currentRule.withActive(!currentRule.isActive);
    await this.rewriteRuleRepository.update(toggledRule);

    const outputData = new ToggleRuleActiveOutputData(toggledRule);
    this.presenter.present(outputData);
  }
}
```

### 7. ToggleRuleActiveController [interface-adapters/controllers]

```typescript
// src/interface-adapters/controllers/rule/ToggleRuleActiveController.ts

import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/rule/IToggleRuleActiveUseCase';
import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/rule/ToggleRuleActiveInputData';

export class ToggleRuleActiveController {
  constructor(
    private readonly useCase: IToggleRuleActiveUseCase
  ) {}

  async toggleActive(ruleId: number): Promise<void> {
    const inputData = new ToggleRuleActiveInputData(ruleId);
    await this.useCase.execute(inputData);
  }
}
```

### 8. ToggleRuleActivePresenter [interface-adapters/presenters]

```typescript
// src/interface-adapters/presenters/rule/ToggleRuleActivePresenter.ts

import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/rule/IToggleRuleActivePresenter';
import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/rule/ToggleRuleActiveOutputData';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

export class ToggleRuleActivePresenter implements IToggleRuleActivePresenter {
  constructor(
    private readonly updateRuleInView: (updatedRule: RewriteRule) => void
  ) {}

  present(outputData: ToggleRuleActiveOutputData): void {
    this.updateRuleInView(outputData.toggledRule);
  }
}
```

### 9. ToggleSwitch [frameworks-and-drivers/ui/components/atoms]

```typescript
// src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.tsx

import * as React from 'react';
import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`${styles.toggle} ${checked ? styles.checked : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.slider} />
    </button>
  );
};
```

### 10. RulesApp での組み立て [frameworks-and-drivers/ui/pages]

```typescript
// src/frameworks-and-drivers/ui/pages/rules/RulesApp.tsx

import * as React from 'react';
import { useState, useCallback } from 'react';
import { container } from 'src/frameworks-and-drivers/di/container';
import { IRewriteRuleRepository } from 'src/interface-adapters/gateways/persistence/IRewriteRuleRepository';
import { ToggleRuleActiveInteractor } from 'src/application-business-rules/interactors/rule/ToggleRuleActiveInteractor';
import { ToggleRuleActiveController } from 'src/interface-adapters/controllers/rule/ToggleRuleActiveController';
import { ToggleRuleActivePresenter } from 'src/interface-adapters/presenters/rule/ToggleRuleActivePresenter';
import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

function RulesApp() {
  const [rules, setRules] = useState<RewriteRule[]>([]);

  // Presenterのコールバック
  const updateRuleInView = useCallback((updatedRule: RewriteRule) => {
    setRules(prev => prev.map(r =>
      r.id === updatedRule.id ? updatedRule : r
    ));
  }, []);

  // トグル操作ハンドラ
  const handleToggleActive = useCallback(async (ruleId: number) => {
    const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
    const presenter = new ToggleRuleActivePresenter(updateRuleInView);
    const interactor = new ToggleRuleActiveInteractor(repository, presenter);
    const controller = new ToggleRuleActiveController(interactor);

    await controller.toggleActive(ruleId);
  }, [updateRuleInView]);

  return (
    // ... 既存のJSX
    <ToggleSwitch
      checked={rule.isActive}
      onChange={() => handleToggleActive(rule.id)}
    />
  );
}
```

## クラス図

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       enterprise-business-rules/                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RewriteRule                                                         │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ + id: number                                                        │   │
│  │ + oldString: string                                                 │   │
│  │ + newString: string                                                 │   │
│  │ + urlPattern: string                                                │   │
│  │ + isRegex: boolean                                                  │   │
│  │ + isActive: boolean                                                 │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ + withActive(isActive: boolean): RewriteRule                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       application-business-rules/                           │
│                                                                             │
│  ┌─────────────────────┐    ┌──────────────────────┐                       │
│  │ <<interface>>       │    │ <<interface>>        │                       │
│  │ IToggleRuleActive   │    │ IToggleRuleActive    │                       │
│  │ UseCase             │    │ Presenter            │                       │
│  │ ─────────────────── │    │ ────────────────────  │                       │
│  │ + execute(input)    │    │ + present(output)    │                       │
│  └──────────▲──────────┘    └──────────▲───────────┘                       │
│             │                          │                                   │
│             │ implements               │ uses                              │
│             │                          │                                   │
│  ┌──────────┴──────────────────────────┴───────────┐                       │
│  │ ToggleRuleActiveInteractor                      │                       │
│  │ ─────────────────────────────────────────────── │                       │
│  │ - repository: IRewriteRuleRepository            │                       │
│  │ - presenter: IToggleRuleActivePresenter         │                       │
│  │ ─────────────────────────────────────────────── │                       │
│  │ + execute(inputData): Promise<void>             │                       │
│  └─────────────────────────────────────────────────┘                       │
│                                                                             │
│  ┌─────────────────────┐    ┌──────────────────────┐                       │
│  │ ToggleRuleActive    │    │ ToggleRuleActive     │                       │
│  │ InputData           │    │ OutputData           │                       │
│  │ ─────────────────── │    │ ────────────────────  │                       │
│  │ + ruleId: number    │    │ + toggledRule: Rule  │                       │
│  └─────────────────────┘    └──────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          interface-adapters/                                │
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ ToggleRuleActiveController  │    │ ToggleRuleActivePresenter   │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ - useCase: IToggleRule...   │    │ - updateRuleInView: Func    │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ + toggleActive(ruleId)      │    │ + present(outputData)       │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
│                                                                             │
│  ┌─────────────────────────────┐                                           │
│  │ <<interface>>               │                                           │
│  │ IRewriteRuleRepository      │                                           │
│  │ ─────────────────────────── │                                           │
│  │ + getById(id): Promise<Rule>│                                           │
│  │ + update(rule): Promise     │                                           │
│  └─────────────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```
