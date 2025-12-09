# PR-002: Migrate（実装を埋める）

## 概要

PR-001で作成したスケルトンに実装を埋める。テストとStorybookを追加。まだ本番コードからは呼び出されない。

## フェーズ

**Migrate** - Parallel Changeパターンの第2フェーズ

## リスク

**低** - 新規実装のみ、既存機能からは呼び出されない

## 前提PR

- [x] PR-001: Expand（スケルトン追加）がマージ済み

## 対象ファイル

### 実装ファイル

| ファイル | 変更内容 | 状態 |
|---------|---------|------|
| `src/application-business-rules/dto/input/rule/ToggleRuleActiveInputData.ts` | constructor実装 | ⬜ |
| `src/application-business-rules/dto/output/rule/ToggleRuleActiveOutputData.ts` | constructor実装 | ⬜ |
| `src/application-business-rules/interactors/rule/ToggleRuleActiveInteractor.ts` | ビジネスロジック実装 | ⬜ |
| `src/interface-adapters/controllers/rule/ToggleRuleActiveController.ts` | 入力変換実装 | ⬜ |
| `src/interface-adapters/presenters/rule/ToggleRuleActivePresenter.ts` | 出力変換実装 | ⬜ |
| `src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.tsx` | UI実装 | ⬜ |
| `src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.module.css` | スタイル実装 | ⬜ |
| `src/frameworks-and-drivers/ui/components/molecules/RulePreviewToggle.tsx` | UI実装 | ⬜ |
| `src/frameworks-and-drivers/ui/components/molecules/RulePreviewToggle.module.css` | スタイル実装 | ⬜ |

### Storybook

| ファイル | 変更種別 | 状態 |
|---------|---------|------|
| `src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch.stories.tsx` | 新規 | ⬜ |
| `src/frameworks-and-drivers/ui/components/molecules/RulePreviewToggle.stories.tsx` | 新規 | ⬜ |

### テストファイル

| ファイル | 変更種別 | 状態 |
|---------|---------|------|
| `tests/unit/enterprise-business-rules/RewriteRule/withActive/normal-cases.test.ts` | 新規 | ⬜ |
| `tests/unit/application-business-rules/interactors/rule/ToggleRuleActiveInteractor/execute/normal-cases.test.ts` | 新規 | ⬜ |
| `tests/unit/application-business-rules/interactors/rule/ToggleRuleActiveInteractor/execute/Abend/error-cases.test.ts` | 新規 | ⬜ |
| `tests/unit/interface-adapters/controllers/rule/ToggleRuleActiveController/toggleActive/normal-cases.test.ts` | 新規 | ⬜ |
| `tests/unit/interface-adapters/presenters/rule/ToggleRuleActivePresenter/present/normal-cases.test.ts` | 新規 | ⬜ |

## 実装詳細

### ToggleRuleActiveInteractor

```typescript
async execute(inputData: ToggleRuleActiveInputData): Promise<void> {
  const currentRule = await this.rewriteRuleRepository.getById(inputData.ruleId);
  const toggledRule = currentRule.withActive(!currentRule.isActive);
  await this.rewriteRuleRepository.update(toggledRule);

  const outputData = new ToggleRuleActiveOutputData(toggledRule);
  this.presenter.present(outputData);
}
```

### ToggleSwitch.tsx

- `role="switch"` でアクセシビリティ対応
- `aria-checked` で状態を伝達
- クリックで `onChange` を呼び出し
- CSSでON/OFF状態を視覚的に表現

### RulePreviewToggle.tsx

- タブ形式のUI
- ローカルstateで表示モード管理
- 「置換前」「置換後」の切り替え

## 完了条件

- [ ] 全スケルトンに実装が埋まっている
- [ ] Storybookで各コンポーネントが確認できる
- [ ] 単体テストが全てパスする
- [ ] `make testlint` がパスする
- [ ] PRがマージされている

## 次のPR

[PR-003: Contract（統合・有効化）](./pr-003-contract.md)
