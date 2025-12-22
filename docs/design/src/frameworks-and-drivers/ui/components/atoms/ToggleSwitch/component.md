# ToggleSwitch コンポーネント テスト戦略

## 目的

ルールの有効/無効を切り替えるToggleSwitchコンポーネントのレンダリングとユーザーインタラクションを検証する。
React Ariaを使用したWAI-ARIA準拠のアクセシビリティを確認する。

## テスト分類

### 1. レンダリング（状態表示）

checked/disabled状態に応じた正しいレンダリングを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| checked=false | data-selected=falseでレンダリング | 無効状態の基本表示 |
| checked=true | data-selected=trueでレンダリング | 有効状態の基本表示 |
| disabled=true | data-disabled=trueでレンダリング | 無効化状態の表示 |
| disabled未指定 | data-disabled=falseでレンダリング | デフォルト値の確認 |

**対応テスト**: `rendering.test.tsx`

### 2. ユーザーインタラクション

クリック操作時のonChangeコールバック呼び出しを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| クリック | onChangeが新しい状態で呼ばれる | 基本インタラクション |
| disabled時クリック | onChangeが呼ばれない | 無効化時の動作 |

**対応テスト**: `interaction.test.tsx`

### 3. アクセシビリティ

WAI-ARIA属性の正しい設定を確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| aria-label | ariaLabel propが設定される | スクリーンリーダー対応 |
| role | switch roleが設定される | ARIA switch role準拠 |

**対応テスト**: `accessibility.test.tsx`

## 網羅性チェック

- [x] checked=true/falseのレンダリング
- [x] disabled=true/falseのレンダリング
- [x] onChange呼び出し
- [x] disabled時のonChange抑制
- [x] aria-label設定
- [x] role属性確認
- [ ] フォーカスリング表示 → 不要（CSSの視覚的確認はStorybookで実施）
- [ ] キーボード操作 → 不要（React Ariaが保証）

## テストファイル構成

```
tests/unit/frameworks-and-drivers/ui/components/atoms/ToggleSwitch/
├── rendering.test.tsx        # レンダリング（4ケース）
├── interaction.test.tsx      # ユーザーインタラクション（2ケース）
└── accessibility.test.tsx    # アクセシビリティ（2ケース）
```

## モック戦略

### モック対象

- **onChange関数**: vi.fn()でモック化し、呼び出しを検証

### テスト環境

- React Testing Library使用
- happy-dom環境（vitest設定済み）

### モック方法

```typescript
const mockOnChange = vi.fn();
render(<ToggleSwitch checked={false} onChange={mockOnChange} ariaLabel="test" />);
```

外部依存（CSSモジュール）はVitestの設定で自動処理されるため、明示的なモックは不要。
