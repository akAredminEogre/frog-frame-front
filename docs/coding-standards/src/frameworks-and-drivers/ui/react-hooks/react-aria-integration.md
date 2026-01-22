# React Ariaコンポーネントとの責任分担

## 概要

React Aria（@react-aria/*）のコンポーネントやフックを使用する場合、React Ariaが管理する機能と手動実装の責任を明確に分離する必要がある。

## 原則: React Ariaが管理する機能は手動で重複実装しない

React Ariaのコンポーネント/フックが特定の機能を管理している場合、同じ機能をuseEffectで手動実装すると**二重実行や競合**が発生する可能性がある。

## FocusScopeの責任分担

`FocusScope`を使用する場合、以下の属性が管理する機能は手動実装しない：

| FocusScope属性 | 管理する機能 | 手動useEffectでの実装 |
|---------------|-------------|---------------------|
| `autoFocus` | 初期フォーカス設定 | **使用しない**（手動useEffectで代替） |
| `restoreFocus` | フォーカス復元 | **実装しない**（競合防止） |
| `contain` | フォーカストラップ | **実装しない** |

### autoFocusを使用しない理由

1. **フォーカス対象を指定できない**: `autoFocus`は最初のフォーカス可能な要素に自動フォーカスする。WAI-ARIAベストプラクティスでは、破壊的アクションを伴うダイアログでは安全な選択肢（キャンセルボタン）にフォーカスすべきだが、`autoFocus`ではこれを制御できない
2. **テスト環境互換性**: happy-dom等のテスト環境で`autoFocus`が正しく動作しない場合がある

**注意**: `autoFocus`と手動useEffectを併用すると競合が発生する。どちらか一方のみを使用すること。

## 例: FocusScopeとuseEffectの併用

```tsx
// ✅ 良い例: autoFocusを使わず、手動useEffectで初期フォーカスを設定
// restoreFocusはFocusScopeに任せるため、クリーンアップでのフォーカス復元は不要
<FocusScope contain restoreFocus>
  <Dialog ref={dialogRef}>...</Dialog>
</FocusScope>

// 手動での初期フォーカス設定
useEffect(() => {
  if (isOpen && buttonRef.current) {
    buttonRef.current.focus();
  }
  // クリーンアップでのフォーカス復元は不要
  // （FocusScopeのrestoreFocusが担当）
}, [isOpen]);
```

```tsx
// ❌ 悪い例1: autoFocusと手動useEffectを併用（競合）
<FocusScope contain restoreFocus autoFocus>
  <Dialog>...</Dialog>
</FocusScope>

useEffect(() => {
  if (isOpen && buttonRef.current) {
    buttonRef.current.focus(); // autoFocusと競合する
  }
}, [isOpen]);
```

```tsx
// ❌ 悪い例2: FocusScopeのrestoreFocusと重複
<FocusScope contain restoreFocus>
  <Dialog>...</Dialog>
</FocusScope>

useEffect(() => {
  if (!isOpen) return;
  const previousElement = document.activeElement;
  buttonRef.current?.focus();

  return () => {
    // これはFocusScopeのrestoreFocusと競合する
    previousElement?.focus();
  };
}, [isOpen]);
```

## usePreventScrollの責任分担

`usePreventScroll`を使用する場合、背景スクロールの無効化/復元は手動実装しない：

```tsx
// ✅ 良い例: usePreventScrollに任せる
usePreventScroll({ isDisabled: !isOpen });

// ❌ 悪い例: 手動でも実装する（重複）
usePreventScroll({ isDisabled: !isOpen });
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);
```

## チェックリスト

React Ariaコンポーネント/フックを使用する際は、以下を確認すること：

- [ ] 使用するReact Ariaコンポーネント/フックが管理する機能を把握したか
- [ ] 手動useEffectで同じ機能を重複実装していないか
- [ ] フォールバック目的のuseEffectは、クリーンアップがReact Ariaの機能と競合しないか
- [ ] ADR等に責任分担を明記したか

## 補足: なぜ重複が問題になるか

1. **二重実行**: 同じ操作が2回実行される（例: フォーカス復元が2回）
2. **競合**: 実行順序によって意図しない結果になる
3. **保守性低下**: どちらが実際に機能しているか不明確になる

## 関連React Ariaパッケージ

| パッケージ | 主な機能 |
|-----------|---------|
| `@react-aria/focus` | FocusScope（フォーカストラップ、自動フォーカス、復元） |
| `@react-aria/overlays` | usePreventScroll（背景スクロール無効化） |
| `@react-aria/dialog` | useDialog（ダイアログセマンティクス） |

## eslint-rule

**部分的にESLint化**:

| ルール | ESLint化 | 設定ファイル |
|-------|---------|-------------|
| FocusScopeのautoFocus禁止 | ✅ 可能 | `eslint-rules/react.js` |
| restoreFocusとの重複実装禁止 | ❌ 不可 | PRレビューで確認 |
| usePreventScrollとの重複実装禁止 | ❌ 不可 | PRレビューで確認 |
