# アクセシブルモーダルコンポーネント規約

## 概要

モーダルダイアログ、確認ダイアログなど、ユーザーの注意を特定のコンテンツに集中させるUIパターンを実装する際の規約。

WAI-ARIA Authoring Practices（Dialog Modal Pattern）に準拠したアクセシビリティ対応を行う。

## 原則: ベースコンポーネントを使用する

新しいダイアログコンポーネントを実装する際は、**ModalDialogBase**を使用すること。

**配置**: `src/frameworks-and-drivers/ui/components/molecules/ModalDialogBase/`

ModalDialogBaseは以下の機能を自動的に提供する：
- ARIA属性（role, aria-modal, aria-labelledby, aria-describedby, tabIndex）
- フォーカストラップ（FocusScope contain）
- フォーカス復元（FocusScope restoreFocus）
- 背景スクロール無効化（usePreventScroll）
- Escapeキーでダイアログを閉じる
- オーバーレイクリックでダイアログを閉じる
- ポータルレンダリング（createPortal）
- useId()によるID自動生成

## 実装チェックリスト

ModalDialogBaseを使用せず、独自にモーダルコンポーネントを実装する場合は、以下のチェックリストを使用して必須要件の漏れを防ぐこと。

### ARIA属性

- [ ] `role="dialog"`
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby`（タイトル要素のIDを参照）
- [ ] `aria-describedby`（説明文がある場合）
- [ ] `tabIndex={-1}`（プログラム的フォーカス設定用）
- [ ] IDは`useId()`で生成（ID競合を防ぐため）

### フォーカス管理

- [ ] 初期フォーカス設定（手動useEffect推奨、テスト環境との互換性のため）
- [ ] フォーカストラップ（`FocusScope contain`）
- [ ] 復帰フォーカス（`FocusScope restoreFocus`）

### キーボード操作

- [ ] Escapeキーでダイアログを閉じる
- [ ] Tab/Shift+Tabでフォーカスがループする

### その他

- [ ] オーバーレイクリックでダイアログを閉じる
- [ ] 背景スクロール無効化（`usePreventScroll`）
- [ ] ポータルレンダリング（`createPortal`）

## React Ariaとの責任分担

React Ariaを使用する場合、以下の責任分担を遵守すること：

| 機能 | React Aria | 手動実装 |
|------|-----------|---------|
| フォーカストラップ | `FocusScope` (contain) | - |
| 初期フォーカス | - | useEffect（autoFocusは使用しない） |
| 復帰フォーカス | `FocusScope` (restoreFocus) | - |
| 背景スクロール無効化 | `usePreventScroll` | - |
| Escapeキー処理 | - | onKeyDownハンドラ |
| オーバーレイクリック | - | onClickハンドラ |

**注意**: `FocusScope`の`autoFocus`属性と手動useEffectを併用すると競合が発生する。初期フォーカスは手動useEffectのみで設定すること。

詳細は[React Hooks コーディング規約](./react-hooks.md)の「React Ariaコンポーネントとの責任分担」セクションを参照。

## eslint-rule

ESLint化不可（モーダルの実装パターンは文脈依存であり、静的解析で正誤を判断できない。PRレビューで確認）

## 関連ドキュメント

- [ADR-007: ダイアログコンポーネントのアクセシビリティ要件](../../../../adr/007-dialog-accessibility-requirements.md)
- [WAI-ARIA Authoring Practices - Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Hooks コーディング規約](./react-hooks.md)
