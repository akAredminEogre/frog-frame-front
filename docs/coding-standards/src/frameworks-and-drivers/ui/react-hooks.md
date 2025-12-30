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

---

## React Ariaコンポーネントとの責任分担

### 概要

React Aria（@react-aria/*）のコンポーネントやフックを使用する場合、React Ariaが管理する機能と手動実装の責任を明確に分離する必要がある。

### 原則: React Ariaが管理する機能は手動で重複実装しない

React Ariaのコンポーネント/フックが特定の機能を管理している場合、同じ機能をuseEffectで手動実装すると**二重実行や競合**が発生する可能性がある。

### FocusScopeの責任分担

`FocusScope`を使用する場合、以下の属性が管理する機能は手動実装しない：

| FocusScope属性 | 管理する機能 | 手動useEffectでの実装 |
|---------------|-------------|---------------------|
| `autoFocus` | 初期フォーカス設定 | フォールバックのみ可（クリーンアップ不要） |
| `restoreFocus` | フォーカス復元 | **実装しない**（競合防止） |
| `contain` | フォーカストラップ | **実装しない** |

### 例: FocusScopeとuseEffectの併用

```tsx
// ✅ 良い例: FocusScopeのautoFocusが効かない場合のフォールバック
// restoreFocusはFocusScopeに任せるため、クリーンアップでのフォーカス復元は不要
<FocusScope contain restoreFocus autoFocus>
  <Dialog ref={dialogRef}>...</Dialog>
</FocusScope>

// フォールバック用のuseEffect（初期フォーカスのみ）
useEffect(() => {
  if (isOpen && buttonRef.current) {
    buttonRef.current.focus();
  }
  // クリーンアップでのフォーカス復元は不要
  // （FocusScopeのrestoreFocusが担当）
}, [isOpen]);
```

```tsx
// ❌ 悪い例: FocusScopeのrestoreFocusと重複
<FocusScope contain restoreFocus autoFocus>
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

### usePreventScrollの責任分担

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

### チェックリスト

React Ariaコンポーネント/フックを使用する際は、以下を確認すること：

- [ ] 使用するReact Ariaコンポーネント/フックが管理する機能を把握したか
- [ ] 手動useEffectで同じ機能を重複実装していないか
- [ ] フォールバック目的のuseEffectは、クリーンアップがReact Ariaの機能と競合しないか
- [ ] ADR等に責任分担を明記したか

### 補足: なぜ重複が問題になるか

1. **二重実行**: 同じ操作が2回実行される（例: フォーカス復元が2回）
2. **競合**: 実行順序によって意図しない結果になる
3. **保守性低下**: どちらが実際に機能しているか不明確になる

### 関連React Ariaパッケージ

| パッケージ | 主な機能 |
|-----------|---------|
| `@react-aria/focus` | FocusScope（フォーカストラップ、自動フォーカス、復元） |
| `@react-aria/overlays` | usePreventScroll（背景スクロール無効化） |
| `@react-aria/dialog` | useDialog（ダイアログセマンティクス） |

## 関連ドキュメント

- [ADR-007: ダイアログコンポーネントのアクセシビリティ要件](../../../../adr/007-dialog-accessibility-requirements.md) - ダイアログ固有のuseEffect実装例
- [React公式ドキュメント - Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
