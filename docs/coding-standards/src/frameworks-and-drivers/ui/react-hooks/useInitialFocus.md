# useInitialFocus - 初期フォーカス設定フック

## 概要

ダイアログやモーダルが開いたときに、指定した要素へ初期フォーカスを設定するカスタムフック。

## なぜ必要か

React AriaのFocusScopeには`autoFocus`属性があるが、テスト環境（happy-dom）との互換性に問題がある。手動のuseEffectで初期フォーカスを設定することで、Reactのライフサイクルに沿った同期的なフォーカス設定が可能になる。

## 使用方法

```tsx
const focusRef = useInitialFocus<HTMLButtonElement>(isOpen);

<FocusScope contain restoreFocus>
  <div role="dialog">
    <button ref={focusRef}>キャンセル</button>
    <button>確認</button>
  </div>
</FocusScope>
```

## 引数

| 引数 | 型 | 説明 |
|-----|---|------|
| `isActive` | `boolean` | trueになったときにフォーカスを設定（例: ダイアログのisOpen） |

## 戻り値

| 型 | 説明 |
|---|------|
| `RefObject<T>` | フォーカス対象要素に設定するref |

## 注意事項

- FocusScopeの`autoFocus`と併用しないこと（競合が発生する）
- FocusScopeの`restoreFocus`はそのまま使用可能（復帰フォーカスは競合しない）

## 関連ドキュメント

- [ADR-007: ダイアログコンポーネントのアクセシビリティ要件](../../../../../adr/007-dialog-accessibility-requirements.md) - 「2. フォーカス管理」セクション
- [React Ariaコンポーネントとの責任分担](./react-aria-integration.md)

## eslint-rule

ESLint化不可（フックの使用パターンは文脈依存。PRレビューで確認）
