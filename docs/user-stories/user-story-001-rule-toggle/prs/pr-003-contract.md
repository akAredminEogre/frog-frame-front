# PR-003: Contract（統合・有効化）

## 概要

PR-002で実装したコンポーネント・UseCaseをRulesAppから呼び出し、機能を有効化する。

## フェーズ

**Contract** - Parallel Changeパターンの第3フェーズ

## リスク

**中** - 既存UIの変更、ユーザー影響あり

## 前提PR

- [x] PR-001: Expand（スケルトン追加）がマージ済み
- [x] PR-002: Migrate（実装を埋める）がマージ済み

## 対象ファイル

### UIファイル

| ファイル | 変更内容 | 状態 |
|---------|---------|------|
| `src/frameworks/ui/pages/rules/RulesApp.tsx` | Controller/Presenter統合、ToggleSwitch/RulePreviewToggle使用 | ⬜ |
| `src/frameworks/entrypoints/rules/style.css` | 必要なスタイル追加（あれば） | ⬜ |

### DIコンテナ

| ファイル | 変更内容 | 状態 |
|---------|---------|------|
| `src/frameworks/di/container.ts` | 必要に応じてDI登録 | ⬜ |

### E2Eテスト

| ファイル | 変更種別 | 状態 |
|---------|---------|------|
| `tests/e2e/rules/toggle-rule-active.spec.ts` | 新規 | ⬜ |

## 実装詳細

### RulesApp.tsx の変更

```typescript
import { ToggleSwitch } from 'src/frameworks/ui/components/atoms/ToggleSwitch';
import { RulePreviewToggle } from 'src/frameworks/ui/components/molecules/RulePreviewToggle';
import { ToggleRuleActiveInteractor } from 'src/usecases/interactors/rule/ToggleRuleActiveInteractor';
import { ToggleRuleActiveController } from 'src/interface-adapters/controllers/rule/ToggleRuleActiveController';
import { ToggleRuleActivePresenter } from 'src/interface-adapters/presenters/rule/ToggleRuleActivePresenter';

function RulesApp() {
  const [rules, setRules] = useState<RewriteRule[]>([]);

  const updateRuleInView = useCallback((updatedRule: RewriteRule) => {
    setRules(prev => prev.map(r =>
      r.id === updatedRule.id ? updatedRule : r
    ));
  }, []);

  const handleToggleActive = useCallback(async (ruleId: number) => {
    const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
    const presenter = new ToggleRuleActivePresenter(updateRuleInView);
    const interactor = new ToggleRuleActiveInteractor(repository, presenter);
    const controller = new ToggleRuleActiveController(interactor);

    await controller.toggleActive(ruleId);
  }, [updateRuleInView]);

  return (
    <table>
      <thead>
        <tr>
          <th>有効</th>           {/* 新規追加 */}
          <th>URLパターン</th>
          <th>置換内容</th>        {/* 変更: 置換前/後 → 置換内容 */}
          <th>正規表現</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {rules.map((rule) => (
          <tr key={rule.id}>
            <td>
              <ToggleSwitch
                checked={rule.isActive}
                onChange={() => handleToggleActive(rule.id)}
              />
            </td>
            <td>{rule.urlPattern}</td>
            <td>
              <RulePreviewToggle
                beforeText={rule.oldString}
                afterText={rule.newString}
              />
            </td>
            <td>{rule.isRegex ? '✓' : '-'}</td>
            <td>
              <button onClick={() => handleEdit(rule.id)}>編集</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### E2Eテスト

```typescript
// tests/e2e/rules/toggle-rule-active.spec.ts

test('ルールのトグルで有効/無効を切り替えられる', async ({ page }) => {
  // 1. ルール一覧ページを開く
  // 2. トグルスイッチをクリック
  // 3. 状態が変わったことを確認
  // 4. ページをリロード
  // 5. 状態が保持されていることを確認
});

test('プレビュー切り替えで置換前/後を表示できる', async ({ page }) => {
  // 1. ルール一覧ページを開く
  // 2. 「置換後」タブをクリック
  // 3. 置換後の内容が表示されることを確認
});
```

## 受け入れ条件との対応

| 受け入れ条件 | 確認方法 | 状態 |
|-------------|---------|------|
| AC-1: トグル表示 | 目視確認 | ⬜ |
| AC-2: トグル操作 | E2Eテスト | ⬜ |
| AC-3: タブリロード | 手動確認 | ⬜ |
| AC-4: プレビュー切替 | E2Eテスト | ⬜ |
| AC-5: パフォーマンス | 手動確認 | ⬜ |
| AC-6: アクセシビリティ | Storybook + 手動確認 | ⬜ |

## 完了条件

- [ ] RulesAppにトグル機能が統合されている
- [ ] RulesAppにプレビュー切替が統合されている
- [ ] E2Eテストが全てパスする
- [ ] `make testlint` がパスする
- [ ] 受け入れ条件が全て満たされている
- [ ] PRがマージされている

## リリース後

- [ ] 機能リリース完了をREADME.mdに記載
- [ ] ユーザーストーリー完了
