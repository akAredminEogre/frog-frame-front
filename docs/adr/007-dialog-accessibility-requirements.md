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

| 属性 | 必須 | 説明 |
|------|------|------|
| role="dialog" | ○ | ダイアログであることを示す |
| aria-modal="true" | ○ | モーダルダイアログであることを示す |
| aria-labelledby | ○ | タイトル要素のIDを参照 |
| aria-describedby | △ | 説明文要素のIDを参照（オプション） |

#### 1.1 ID生成にuseId()を使用（必須）

`aria-labelledby`や`aria-describedby`で参照するIDは、**必ずReactの`useId()`フックを使用して生成すること**。

**理由**:
- ハードコードされたID（例: `confirm-dialog-title`）は、同一ページ内で複数のダイアログが同時にレンダリングされた場合にID競合を引き起こす
- `useId()`はReact 18で導入されたフックで、サーバーサイドレンダリングでも安全に一意のIDを生成する
- 将来的な拡張性を確保し、コンポーネントの再利用性を高める

**実装例**:

```tsx
import { useId } from 'react';

const MyDialog: React.FC<Props> = ({ ... }) => {
  const uniqueId = useId();
  const titleId = `dialog-title-${uniqueId}`;
  const descriptionId = `dialog-description-${uniqueId}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <h2 id={titleId}>タイトル</h2>
      <p id={descriptionId}>説明文</p>
    </div>
  );
};
```

**注意**: IDの接頭辞（例: `dialog-title-`）は、デバッグ時の可読性のために付与することを推奨する。

#### 2. フォーカス管理

| 要件 | 説明 |
|------|------|
| 初期フォーカス | ダイアログが開いたとき、最初のフォーカス可能な要素にフォーカスを移動 |
| フォーカストラップ | ダイアログが開いている間、Tab/Shift+Tabでフォーカスがダイアログ内に閉じ込められる |
| 復帰フォーカス | ダイアログが閉じたとき **またはコンポーネントがアンマウントされたとき**、ダイアログを開いたトリガー要素にフォーカスを戻す |

#### 2.1 useEffectクリーンアップでの副作用復元（必須）

useEffectで行った副作用（背景スクロール無効化、フォーカス移動など）は、**すべてクリーンアップ関数で元に戻すこと**。

**理由**:
- `isOpen`がfalseになった場合だけでなく、コンポーネントがアンマウントされた場合にも副作用を復元する必要がある
- 例：親コンポーネントが条件付きレンダリングでダイアログを完全に削除した場合

**実装例**:

```tsx
useEffect(() => {
  if (isOpen) {
    // 副作用を適用
    previousActiveElementRef.current = document.activeElement;
    cancelButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
  } else {
    // isOpen=falseで復元
    document.body.style.overflow = '';
    if (previousActiveElementRef.current instanceof HTMLElement) {
      previousActiveElementRef.current.focus();
    }
  }

  return () => {
    // アンマウント時にも同様に復元（必須）
    document.body.style.overflow = '';
    if (previousActiveElementRef.current instanceof HTMLElement) {
      previousActiveElementRef.current.focus();
    }
  };
}, [isOpen]);
```

**原則**: セットアップで行った変更はすべてクリーンアップで元に戻す。

#### 3. キーボードイベント処理

| キー | 動作 |
|------|------|
| Escape | ダイアログを閉じる |
| Tab | 次のフォーカス可能な要素に移動（最後の要素から最初の要素にループ） |
| Shift + Tab | 前のフォーカス可能な要素に移動（最初の要素から最後の要素にループ） |

#### 4. 外側クリックでのクローズ

ダイアログの背景（オーバーレイ）をクリックした場合、ダイアログを閉じる。

#### 5. ポータルレンダリング

z-indexの問題を回避し、DOMツリーの最上位にダイアログをレンダリングするため、React Portalを使用する。

#### 6. 背景スクロールの無効化

ダイアログが開いている間、背景のスクロールを無効化する。

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

### 適用済みの箇所

以下のコンポーネントは本ADRの要件を満たしている：

| コンポーネント | 配置 | 状態 |
|---------------|------|------|
| ConfirmDialog | `src/frameworks-and-drivers/ui/components/organisms/` | ADR-007準拠（useId使用） |

## 影響ドキュメント

このADRが変更された場合、以下のドキュメントも更新が必要：

- なし

## 関連ドキュメント

- [WAI-ARIA Authoring Practices - Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Aria useDialog](https://react-spectrum.adobe.com/react-aria/useDialog.html)
