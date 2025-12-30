# React Hooks コーディング規約

## 概要

React Hooksを使用する際の副作用管理に関する規約。特にuseEffectでの副作用の適用とクリーンアップについて定める。

## useEffectの副作用管理ルール

### 原則: セットアップで行った変更はすべてクリーンアップで元に戻す

useEffectで副作用を適用した場合、クリーンアップ関数で必ず元の状態に復元すること。

### よくある副作用とクリーンアップ

| セットアップで行うこと | クリーンアップで戻すこと |
|----------------------|------------------------|
| `document.body.style.overflow = 'hidden'` | `document.body.style.overflow = ''` |
| `element.focus()` | `previousElement.focus()` |
| `document.addEventListener(...)` | `document.removeEventListener(...)` |
| `setInterval(...)` | `clearInterval(...)` |
| `setTimeout(...)` | `clearTimeout(...)` |
| `subscription.subscribe()` | `subscription.unsubscribe()` |

### よくある見落とし

#### 状態変更での復元のみ実装し、クリーンアップ関数での復元を忘れる

```tsx
// ❌ 悪い例: クリーンアップでの復元が不完全
useEffect(() => {
  if (isOpen) {
    previousElement.current = document.activeElement;
    dialogElement.current?.focus();
    document.body.style.overflow = 'hidden';
  } else {
    // isOpen=falseでの復元は実装されている
    document.body.style.overflow = '';
    previousElement.current?.focus();
  }

  return () => {
    // クリーンアップではoverflow復元のみ、フォーカス復元が漏れている
    document.body.style.overflow = '';
  };
}, [isOpen]);
```

```tsx
// ✅ 良い例: クリーンアップでも同様に復元
useEffect(() => {
  if (isOpen) {
    previousElement.current = document.activeElement;
    dialogElement.current?.focus();
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    // refが設定されている（ダイアログが開かれた）場合のみフォーカス復帰
    if (previousElement.current && previousElement.current instanceof HTMLElement) {
      previousElement.current.focus();
    }
  }

  return () => {
    // アンマウント時にも同様に復元
    document.body.style.overflow = '';
    // refが設定されている（ダイアログが開かれた）場合のみフォーカス復帰
    if (previousElement.current && previousElement.current instanceof HTMLElement) {
      previousElement.current.focus();
    }
  };
}, [isOpen]);
```

#### refの防御的チェック

クリーンアップ関数でrefの値を使用する際、refが実際に設定されているか明示的にチェックすること。

- コンポーネントがマウントされたが、refを設定する条件が一度も満たされなかった場合（例: ダイアログが一度も開かれずにアンマウント）、refは初期値（通常`null`）のままである
- `null instanceof HTMLElement`は`false`を返すため技術的には安全だが、明示的なチェックにより意図が明確になる

### なぜクリーンアップが重要か

useEffectのクリーンアップ関数は以下のタイミングで実行される：

1. **依存配列の値が変化したとき**（次のエフェクト実行前）
2. **コンポーネントがアンマウントされたとき**

特に2のケースを見落としやすい。例えば：

- 親コンポーネントが条件付きレンダリングでコンポーネントを削除した場合
- ルーティングで別のページに遷移した場合
- エラーバウンダリでコンポーネントがアンマウントされた場合

これらのケースでは、`isOpen`の状態変化を経由せずにコンポーネントが消えるため、クリーンアップ関数でのみ副作用を復元できる。

### チェックリスト

useEffectを実装する際は、以下を確認すること：

- [ ] セットアップで適用した副作用をすべてリストアップしたか
- [ ] 各副作用に対応するクリーンアップをクリーンアップ関数に実装したか
- [ ] 状態変更（例：`isOpen=false`）での復元と、クリーンアップ関数での復元が同等か
- [ ] コンポーネントがアンマウントされるケースを考慮したか

### 補足: 状態変更とクリーンアップの重複は許容される

状態変更時（例: `isOpen=false`）の復元処理と、クリーンアップ関数での復元処理が重複して実行される場合がある。

例: `isOpen`が`true`から`false`に変化したとき：
1. まずクリーンアップ関数が実行される（前のエフェクトの後始末）
2. 次にエフェクト本体が実行され、`else`ブロックで復元処理が実行される

この重複は**許容される**。理由は以下の通り：

- 復元処理は冪等（同じ操作を複数回実行しても結果が変わらない）
  - 例: `document.body.style.overflow = ''` は何度実行しても同じ結果
  - 例: `element.focus()` は既にフォーカスがあっても問題ない
- 重複を避けるためにロジックを複雑化するより、シンプルに両方で復元する方が保守性が高い
- 両方で復元を実装することで、どちらのパスでも確実に復元される（防御的プログラミング）

---

## Props依存状態のリセット

### 原則: 内部状態がpropsの変化に依存する場合、useEffectでリセットすること

コンポーネントの内部状態（useState）がpropsの変化に応じてリセットされるべき場合、useEffectを使用して明示的にリセットする。

### 適用場面

| シナリオ | 内部状態 | リセットトリガー |
|---------|---------|-----------------|
| ダイアログの開閉 | 処理中フラグ、入力値 | `isOpen`がtrueになったとき |
| フォームの編集対象変更 | フォーム入力値 | 編集対象IDが変わったとき |
| タブ切り替え | スクロール位置、選択状態 | アクティブタブが変わったとき |

### なぜ必要か

コンポーネントがアンマウントされずに再利用される場合、内部状態は前回の値を保持したままになる。

例: ダイアログコンポーネントが`isOpen`で表示/非表示を切り替える場合
- `isOpen: false → true`になっても、コンポーネントはアンマウントされない
- 前回の操作で設定された内部状態（例: `isProcessing=true`）がそのまま残る
- 結果として、ダイアログ再オープン時にボタンが操作不能になる等の問題が発生

### チェックリスト

useState を使用する際は、以下を確認すること：

- [ ] この状態はpropsの変化に応じてリセットされるべきか
- [ ] コンポーネントが再利用される（アンマウントされない）ケースを考慮したか
- [ ] リセットが必要な場合、useEffectでリセット処理を実装したか

## eslint-rule

ESLint化不可（useEffect/useStateの使用パターンは文脈依存であり、静的解析で正誤を判断できない。PRレビューで確認）

## 関連ドキュメント

- [ADR-007: ダイアログコンポーネントのアクセシビリティ要件](../../../../adr/007-dialog-accessibility-requirements.md) - ダイアログ固有のuseEffect実装例
- [React公式ドキュメント - Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
