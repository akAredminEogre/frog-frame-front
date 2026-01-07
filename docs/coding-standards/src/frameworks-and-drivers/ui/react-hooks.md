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
| `autoFocus` | 初期フォーカス設定 | **使用しない**（手動useEffectで代替、テスト環境互換性のため） |
| `restoreFocus` | フォーカス復元 | **実装しない**（競合防止） |
| `contain` | フォーカストラップ | **実装しない** |

**注意**: `autoFocus`と手動useEffectを併用すると競合が発生する。どちらか一方のみを使用すること。テスト環境（happy-dom）との互換性を考慮し、手動useEffectでの初期フォーカス設定を推奨する。

### 例: FocusScopeとuseEffectの併用

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

---

## useRefの型ガイドライン

### 概要

`useRef`は初期値によって異なる型を返す。不要な型キャストを避け、TypeScriptの型推論を活用する。

### useRefの型オーバーロード

Reactの`useRef`は以下の型オーバーロードを持つ：

```typescript
// 1. 初期値がnullの場合 → RefObject<T>を返す（DOM要素用）
function useRef<T>(initialValue: T | null): RefObject<T>;

// 2. 初期値が非nullの場合 → MutableRefObject<T>を返す
function useRef<T>(initialValue: T): MutableRefObject<T>;

// 3. 初期値なしの場合 → MutableRefObject<T | undefined>を返す
function useRef<T = undefined>(): MutableRefObject<T | undefined>;
```

### RefObject vs MutableRefObject

| 型 | currentプロパティ | 主な用途 |
|---|------------------|---------|
| `RefObject<T>` | `readonly current: T \| null` | DOM要素への参照 |
| `MutableRefObject<T>` | `current: T` | 任意の可変値の保持 |

### DOM要素用refの正しい書き方

```typescript
// ✅ 良い例: 型キャスト不要
const useInitialFocus = <T extends HTMLElement>(isActive: boolean): RefObject<T> => {
  const ref = useRef<T>(null);  // RefObject<T>を返す

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.focus();
    }
  }, [isActive]);

  return ref;  // 型キャスト不要
};
```

```typescript
// ❌ 悪い例: 不要な型キャスト
const ref = useRef<T>(null);
return ref as RefObject<T>;  // 不要なキャスト
```

### なぜキャストが不要か

`useRef<T>(null)`を呼び出すと：

1. TypeScriptは引数`null`を見て、オーバーロード `useRef<T>(initialValue: T | null): RefObject<T>` にマッチ
2. 戻り値は自動的に`RefObject<T>`になる
3. `RefObject<T>`は`{ readonly current: T | null }`なので、`current`がnullになりうることは型に含まれている

したがって、追加のキャストは不要。

### チェックリスト

`useRef`を使用する際は、以下を確認すること：

- [ ] DOM要素用には`useRef<T>(null)`を使用しているか（nullを初期値に）
- [ ] 戻り値の型を明示する場合、`RefObject<T>`で十分か（`RefObject<T | null>`は冗長）
- [ ] 不要な`as RefObject<T>`キャストを追加していないか

### Propsで受け取るRefの型

`useRef<T>(null)`で作成したrefを子コンポーネントにpropsで渡す場合、受け取る側の型定義は`RefObject<T>`とする（`| null`は不要）。

```typescript
// ✅ 正しい型定義
interface ChildProps {
  dialogRef: RefObject<HTMLDivElement>;
}

// ❌ 誤った型定義: | null は不要（DOM要素のref属性と互換性がなくなる）
interface ChildProps {
  dialogRef: RefObject<HTMLDivElement | null>;
}
```

**理由**:
- `RefObject<T>`は既に`{ readonly current: T | null }`という型を持つ
- 型パラメータに`| null`を追加すると`RefObject<HTMLDivElement | null>`となり、DOM要素の`ref`属性（`LegacyRef<HTMLDivElement>`）と互換性がなくなる
- `useRef<HTMLDivElement>(null)`は`RefObject<HTMLDivElement>`を返すので、そのまま使用する

### eslint-rule

ESLint化不可（型キャストの必要性は文脈依存であり、静的解析で正誤を判断できない。PRレビューで確認）

---

## コールバックのメモ化

### 概要

JSX内で関数を生成するとレンダリングごとに新しいインスタンスが作成される。パフォーマンス最適化のため、適切にメモ化する。

### 問題パターン: レンダー中の関数生成

```tsx
// ❌ 悪い例: レンダーごとに新しい関数インスタンスが生成される
const MyComponent = ({ onAction }) => {
  const { guardedHandler } = useProcessingGuard();

  return (
    <>
      {/* guardedHandler(onAction) がレンダーごとに呼ばれる */}
      <button onClick={guardedHandler(onAction)}>実行</button>
      <button onClick={guardedHandler(onAction)}>実行2</button>  {/* 別インスタンス */}
    </>
  );
};
```

このパターンの問題点：
1. **毎回新しい関数が生成される**: `guardedHandler(onAction)` はレンダー中に実行され、戻り値（関数）が毎回新しいインスタンスになる
2. **同じハンドラでも別インスタンス**: 同じ `guardedHandler(onAction)` を複数箇所で使うと、それぞれ別の関数インスタンスになる
3. **子コンポーネントの再レンダリング**: 新しい関数インスタンスが渡されると、`React.memo` 等のメモ化が無効化される

### 解決策: useMemoでメモ化

```tsx
// ✅ 良い例: ハンドラをメモ化
const MyComponent = ({ onAction, onCancel }) => {
  const { guardedHandler } = useProcessingGuard();

  // ガード済みハンドラをメモ化
  const handleAction = useMemo(
    () => guardedHandler(onAction),
    [guardedHandler, onAction]
  );
  const handleCancel = useMemo(
    () => guardedHandler(onCancel),
    [guardedHandler, onCancel]
  );

  return (
    <>
      <button onClick={handleAction}>実行</button>
      <button onClick={handleAction}>実行2</button>  {/* 同じインスタンス */}
      <button onClick={handleCancel}>キャンセル</button>
    </>
  );
};
```

### useMemo vs useCallback

| フック | 用途 | 例 |
|-------|------|---|
| `useCallback` | 関数自体をメモ化 | `useCallback(() => doSomething(), [deps])` |
| `useMemo` | 関数の**戻り値**をメモ化 | `useMemo(() => createHandler(), [deps])` |

**使い分け**:
- 単純なイベントハンドラ → `useCallback`
- 関数を返す関数（ファクトリ）の結果 → `useMemo`

```tsx
// useCallback: 関数自体をメモ化
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

// useMemo: 関数を返す関数の結果をメモ化
const guardedClick = useMemo(
  () => guardedHandler(onClick),  // guardedHandlerの戻り値をメモ化
  [guardedHandler, onClick]
);
```

### メモ化が必要なケース

| ケース | 理由 |
|-------|------|
| 同じハンドラを複数箇所で使用 | インスタンスの一貫性を保つ |
| 子コンポーネントにハンドラを渡す | `React.memo` の効果を維持 |
| 関数を返す関数（ファクトリ）の結果を使用 | 毎回新しい関数が生成されるのを防ぐ |

### チェックリスト

コールバックを使用する際は、以下を確認すること：

- [ ] JSX内で `fn(arg)` 形式で関数を呼び出していないか（レンダー中の関数生成）
- [ ] 同じハンドラを複数箇所で使用していないか
- [ ] 子コンポーネントにハンドラを渡す場合、メモ化を検討したか
- [ ] `useCallback` と `useMemo` を適切に使い分けているか

### eslint-rule

部分的にESLint化可能:
- `react-hooks/exhaustive-deps`: 依存配列の漏れを検出
- ただし「メモ化すべきかどうか」は文脈依存のためPRレビューで確認

---

## カスタムフックのJSDoc記述ルール

### 概要

カスタムフックを作成する際、利用者が正しく使用できるよう、設計上の前提条件と制約をJSDocに記載する。

### 記載すべき情報

#### 1. 設計上の前提条件（@remarks）

フックが正しく動作するために必要な使用パターンを記載する:

- 引数に渡される値の意味（例: `isActive`はダイアログの開閉状態）
- 呼び出し元に期待する振る舞い（例: ハンドラはダイアログを閉じる処理を含む）
- 状態がリセットされるタイミング
- 前提が満たされない場合の影響

#### 2. 制約事項

技術的な制約を記載する:

- 同期/非同期の制約（例: 同期ハンドラのみサポート）
- 特定の環境での制限

### 悪い例

```typescript
/**
 * 連続クリック防止のためのカスタムフック
 * @param isActive - trueになったときにリセット
 */
```

→ 何を「リセット」するか、なぜ`isActive`が必要か不明

### 良い例

```typescript
/**
 * 連続クリック防止のためのカスタムフック
 *
 * @remarks
 * このフックは以下の使用パターンを前提としている:
 * - isActiveはモーダルダイアログの開閉状態を表す
 * - ガード対象のハンドラはダイアログを閉じる処理を含む
 * - 処理状態はダイアログ再オープン時（isActiveがtrueになったとき）にリセットされる
 * - ハンドラが同期的に完了する、またはダイアログを即座に閉じる
 *
 * 上記の前提が満たされない場合（例: バリデーションエラーでダイアログを開いたまま、
 * 非同期処理の完了を待つ必要がある等）、このフックは適切に機能しない。
 *
 * @param isActive - trueになったときに処理状態をリセット（例: ダイアログのisOpen）
 */
```

### なぜ必要か

- 型定義だけでは表現できない制約がある（例: `() => void`はasync関数も受け入れるが、実際には同期処理のみサポート）
- 利用者が誤った使い方をするリスクを軽減する
- 将来の拡張ポイントを明確にする

### チェックリスト

カスタムフックを作成する際は、以下を確認すること:

- [ ] 引数の意味と期待される値をJSDocに記載したか
- [ ] フックが前提とする使用パターンを`@remarks`に記載したか
- [ ] 前提が満たされない場合の影響を記載したか
- [ ] 同期/非同期などの技術的制約を記載したか

### eslint-rule

ESLint化不可（JSDocの内容の適切さは文脈依存であり、静的解析で判断できない。PRレビューで確認）

---

## 状態ガード/ロックの実装ルール

### 概要

処理中フラグやロック機構を実装する際、エラー時の状態リセット漏れを防ぐためのルール。

### 原則: エラー時は必ず状態をリセットする

ハンドラ内でエラーが発生した場合、状態が永続化してUIが操作不能になることを防ぐため、エラー時は状態をリセットすること。

### パターン1: 処理完了後に即座にリセットする場合（try-finally）

単発の処理で、完了後すぐにリセットして次の操作を受け付ける場合。

```typescript
const handleSubmit = () => {
  if (isProcessing) return;
  isProcessing = true;
  try {
    submitData();
  } finally {
    isProcessing = false; // 正常・エラー問わずリセット
  }
};
```

### パターン2: 別の条件でリセットする場合（try-catch）

連続クリック防止など、正常完了時は状態を維持し、別の条件（ダイアログ再オープン等）でリセットする場合。

```typescript
const guardedHandler = (handler) => {
  return () => {
    if (isProcessing) return;
    isProcessing = true;
    try {
      handler();
      // 正常完了時はリセットしない（連続クリック防止）
      // 別の条件（isActive=true等）でリセットされる
    } catch (error) {
      isProcessing = false; // エラー時のみリセット
      throw error;
    }
  };
};
```

### 悪い例

```typescript
const guardedHandler = (handler) => {
  return () => {
    if (isProcessing) return;
    isProcessing = true;
    handler(); // エラー時にisProcessingがtrueのまま
  };
};
```

→ handlerがエラーをスローすると、isProcessingが永続化してボタンが操作不能になる

### パターンの選択基準

| 要件 | パターン |
|-----|---------|
| 処理完了後すぐに次の操作を受け付ける | try-finally |
| 連続クリック防止（正常完了時は状態維持） | try-catch（エラー時のみリセット） |

### チェックリスト

状態ガード/ロックを実装する際は、以下を確認すること:

- [ ] エラー発生時に状態がリセットされるか
- [ ] 正常完了時のリセットタイミングは適切か（即座 or 別条件）
- [ ] 非同期処理の場合、Promiseの完了を待ってからリセットしているか

### eslint-rule

ESLint化不可（状態管理のパターンは文脈依存であり、静的解析で正誤を判断できない。PRレビューで確認）

## 関連ドキュメント

- [ADR-007: ダイアログコンポーネントのアクセシビリティ要件](../../../../adr/007-dialog-accessibility-requirements.md) - ダイアログ固有のuseEffect実装例
- [React公式ドキュメント - Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React公式ドキュメント - useRef](https://react.dev/reference/react/useRef)
