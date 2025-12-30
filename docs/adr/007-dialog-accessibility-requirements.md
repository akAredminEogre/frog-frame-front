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
| tabIndex={-1} | ○ | プログラム的なフォーカス設定を可能にする |

**tabIndex={-1}について**: ダイアログコンテナに`tabIndex={-1}`を設定することで、JavaScriptからプログラム的にフォーカスを設定可能になる。これはWAI-ARIA Dialog Modal Patternのベストプラクティスであり、より堅牢なフォーカス管理を実現する。

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
      tabIndex={-1}
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

#### 2.1 React Ariaによる自動管理

React Ariaを使用する場合、以下の機能が自動化される：

| 機能 | React Aria Hook/Component |
|------|--------------------------|
| フォーカストラップ | `FocusScope` (contain) |
| 初期フォーカス | `FocusScope` (autoFocus) |
| 復帰フォーカス | `FocusScope` (restoreFocus) |
| 背景スクロール無効化 | `usePreventScroll` |

手動実装が必要な場合は、[React Hooks コーディング規約](../coding-standards/src/frameworks-and-drivers/ui/react-hooks.md)を参照。

#### 3. キーボードイベント処理

| キー | 動作 | 実現方法 |
|------|------|---------|
| Escape | ダイアログを閉じる | 手動ハンドラ（onKeyDown） |
| Tab | 次のフォーカス可能な要素に移動（ループ） | `FocusScope` (contain) |
| Shift + Tab | 前のフォーカス可能な要素に移動（ループ） | `FocusScope` (contain) |

フォーカストラップはReact Ariaの`FocusScope`で自動化。Escapeキーは手動ハンドラで処理。

#### 4. 外側クリックでのクローズ

ダイアログの背景（オーバーレイ）をクリックした場合、ダイアログを閉じる。

オーバーレイのonClickハンドラで手動処理（ダイアログ内クリックとの判別が必要）。

#### 5. ポータルレンダリング

z-indexの問題を回避し、DOMツリーの最上位にダイアログをレンダリングするため、React Portalを使用する。

#### 6. 背景スクロールの無効化

ダイアログが開いている間、背景のスクロールを無効化する。

### 実装チェックリスト

ダイアログコンポーネントを実装する際、以下のチェックリストを使用して必須要件の漏れを防ぐこと。

#### ARIA属性

- [ ] `role="dialog"`
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby`（タイトル要素のIDを参照）
- [ ] `aria-describedby`（説明文がある場合）
- [ ] `tabIndex={-1}`（プログラム的フォーカス設定用）
- [ ] IDは`useId()`で生成

#### フォーカス管理

- [ ] 初期フォーカス設定（`FocusScope autoFocus` または手動）
- [ ] フォーカストラップ（`FocusScope contain`）
- [ ] 復帰フォーカス（`FocusScope restoreFocus`）

#### キーボード操作

- [ ] Escapeキーでダイアログを閉じる
- [ ] Tab/Shift+Tabでフォーカスがループする

#### その他

- [ ] オーバーレイクリックでダイアログを閉じる
- [ ] 背景スクロール無効化（`usePreventScroll`）
- [ ] ポータルレンダリング（`createPortal`）

### 推奨ライブラリ（採用済み）

本プロジェクトでは**React Aria**を採用している（ハイブリッドアプローチ）。以下のパッケージを使用：

| パッケージ | 用途 |
|-----------|------|
| `@react-aria/dialog` | ダイアログのセマンティクス（useDialog） |
| `@react-aria/overlays` | スクロール防止（usePreventScroll） |
| `@react-aria/focus` | フォーカストラップ、フォーカス復元（FocusScope） |

**ハイブリッドアプローチ**:
- React Ariaで自動化: フォーカストラップ、フォーカス復元、スクロール防止、aria属性
- 手動実装: Escapeキー処理、オーバーレイクリック処理

**この選択の理由**:
- テスト環境（happy-dom）との互換性を確保
- `useOverlay`はテスト環境で問題が発生する可能性がある
- 必要な機能は維持しつつ、堅牢性を優先

**代替ライブラリ**（参考）:

| ライブラリ | 特徴 |
|-----------|------|
| Radix UI (Dialog) | ヘッドレスUI、アクセシビリティ完備 |
| Headless UI (Dialog) | Tailwind Labs製、アクセシビリティ完備 |

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
| ConfirmDialog | `src/frameworks-and-drivers/ui/components/organisms/` | React Aria採用（useDialog, FocusScope, usePreventScroll） |

## 影響ドキュメント

このADRが変更された場合、以下のドキュメントも更新が必要：

- なし

## 関連ドキュメント

- [WAI-ARIA Authoring Practices - Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Aria useDialog](https://react-spectrum.adobe.com/react-aria/useDialog.html)
- [React Hooks コーディング規約](../coding-standards/src/frameworks-and-drivers/ui/react-hooks.md) - useEffectの副作用管理ルール
