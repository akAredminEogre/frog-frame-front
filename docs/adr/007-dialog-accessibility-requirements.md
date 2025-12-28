# ADR-007: ダイアログコンポーネントのアクセシビリティ要件

## ステータス

採用

## コンテキスト

モーダルダイアログ（ConfirmDialogなど）は、ユーザーの注意を特定のコンテンツに集中させるUIパターンである。適切なアクセシビリティ対応がないと、スクリーンリーダーユーザーやキーボードユーザーにとって使いづらいものになる。

WAI-ARIA Authoring Practices（Dialog Modal Pattern）に準拠したアクセシビリティ対応が必要である。

## 決定

ダイアログコンポーネント（ConfirmDialog等）を実装する際は、以下の要件を満たすこと。

### 必須要件

#### 1. ARIA属性

```typescript
// 必須のARIA属性
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"      // タイトル要素のID
  aria-describedby="dialog-description" // 説明文要素のID（オプション）
>
```

#### 2. フォーカス管理

| 要件 | 説明 |
|------|------|
| 初期フォーカス | ダイアログが開いたとき、最初のフォーカス可能な要素（通常は最初のボタンまたは閉じるボタン）にフォーカスを移動 |
| フォーカストラップ | ダイアログが開いている間、Tab/Shift+Tabでフォーカスがダイアログ内に閉じ込められる |
| 復帰フォーカス | ダイアログが閉じたとき、ダイアログを開いたトリガー要素にフォーカスを戻す |

```typescript
// フォーカス管理の実装例
useEffect(() => {
  if (isOpen) {
    // 1. 開く前のフォーカス要素を保存
    previousFocusRef.current = document.activeElement;
    // 2. ダイアログ内の最初の要素にフォーカス
    firstFocusableRef.current?.focus();
  }
  return () => {
    // 3. 閉じたときに元の要素にフォーカスを戻す
    previousFocusRef.current?.focus();
  };
}, [isOpen]);
```

#### 3. キーボードイベント処理

| キー | 動作 |
|------|------|
| Escape | ダイアログを閉じる |
| Tab | 次のフォーカス可能な要素に移動（最後の要素から最初の要素にループ） |
| Shift + Tab | 前のフォーカス可能な要素に移動（最初の要素から最後の要素にループ） |

```typescript
// ESCキー処理の実装例
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      onCancel();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onCancel]);
```

#### 4. 外側クリックでのクローズ

ダイアログの背景（オーバーレイ）をクリックした場合、ダイアログを閉じる。

```typescript
// オーバーレイクリック処理の実装例
const handleOverlayClick = (event: React.MouseEvent) => {
  if (event.target === event.currentTarget) {
    onCancel();
  }
};
```

#### 5. ポータルレンダリング

z-indexの問題を回避し、DOMツリーの最上位にダイアログをレンダリングするため、React Portalを使用する。

```typescript
// ポータルレンダリングの実装例
import { createPortal } from 'react-dom';

return createPortal(
  <div className="dialog-overlay">
    <div role="dialog" aria-modal="true">
      {/* ダイアログコンテンツ */}
    </div>
  </div>,
  document.body
);
```

#### 6. 背景スクロールの無効化

ダイアログが開いている間、背景のスクロールを無効化する。

```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);
```

### 推奨ライブラリ

上記要件を手動で実装する代わりに、以下のライブラリの使用を推奨する：

| ライブラリ | 特徴 |
|-----------|------|
| React Aria (useDialog) | Adobe製、アクセシビリティ完備、スタイル非依存 |
| Radix UI (Dialog) | ヘッドレスUI、アクセシビリティ完備 |
| Headless UI (Dialog) | Tailwind Labs製、アクセシビリティ完備 |

本プロジェクトでは既にReact Aria（ToggleSwitchで使用）を採用しているため、`@react-aria/dialog` の使用を推奨する。

### ビジュアルスタイリング要件

| 要素 | 要件 |
|------|------|
| オーバーレイ | 半透明の背景で、下層コンテンツとの視覚的分離を明確にする |
| ダイアログ本体 | 中央配置、適切なパディング、明確な境界 |
| フォーカス表示 | フォーカス状態が視覚的に明確である（:focus-visible） |
| ボタン配置 | 破壊的アクション（削除等）は目立つ位置に配置し、色で警告を示す |

## 理由

1. **法的要件**: WCAG 2.1準拠は多くの地域で法的要件となっている
2. **ユーザビリティ**: キーボードユーザー、スクリーンリーダーユーザーの操作性向上
3. **一貫性**: WAI-ARIA標準に従うことで、ユーザーの期待通りの動作を提供
4. **メンテナンス性**: 標準パターンに従うことで、将来の変更が容易

## 適用対象

- ConfirmDialog
- 今後作成するモーダルダイアログコンポーネント

## 影響ドキュメント

このADRが変更された場合、以下のドキュメントも更新が必要：

- なし

## 関連ドキュメント

- [WAI-ARIA Authoring Practices - Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Aria useDialog](https://react-spectrum.adobe.com/react-aria/useDialog.html)
