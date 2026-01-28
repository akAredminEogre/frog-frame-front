# 状態ガード/ロックの実装ルール

## 概要

処理中フラグやロック機構を実装する際、エラー時の状態リセット漏れを防ぐためのルール。

## 原則: エラー時は必ず状態をリセットする

ハンドラ内でエラーが発生した場合、状態が永続化してUIが操作不能になることを防ぐため、エラー時は状態をリセットすること。

## パターン1: 処理完了後に即座にリセットする場合（try-finally）

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

## パターン2: 別の条件でリセットする場合（try-catch）

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

## パターン3: `void` で呼び出される async 関数の例外握りつぶし（try-catch-finally）

`void asyncFunction()` で呼び出される async 関数では、reject が発生すると未処理の Promise 拒否（unhandled rejection）になる。エラー通知が別経路（コールバック、State 更新等）で既に行われている場合は、`catch` で例外を握りつぶし、`finally` で状態をリセットする。

```typescript
// ✅ Good: catch で握りつぶし、finally で状態リセット
const confirmDelete = useCallback(async () => {
  if (targetId === null) return;
  setProcessingIds((prev) => new Set(prev).add(targetId));
  try {
    await deleteRule(targetId);
  } catch {
    // エラーは onError コールバックで通知済み
    // void confirmDelete() で呼び出されるため、ここで握りつぶして未処理のPromise拒否を防ぐ
  } finally {
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(targetId);
      return next;
    });
  }
}, [targetId]);
// 呼び出し側: void confirmDelete();
```

```typescript
// ❌ Bad: void で呼ばれるのに reject が未処理
const confirmDelete = useCallback(async () => {
  setProcessingIds((prev) => new Set(prev).add(targetId));
  try {
    await deleteRule(targetId); // reject → unhandled rejection
  } finally {
    setProcessingIds((prev) => { /* ... */ });
  }
}, [targetId]);
// 呼び出し側: void confirmDelete();
```

## 悪い例

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

## パターンの選択基準

| 要件 | パターン |
|-----|---------|
| 処理完了後すぐに次の操作を受け付ける | try-finally |
| 連続クリック防止（正常完了時は状態維持） | try-catch（エラー時のみリセット） |
| `void` で呼ばれる async 関数（エラー通知は別経路） | try-catch-finally（catch で握りつぶし、finally でリセット） |

## チェックリスト

状態ガード/ロックを実装する際は、以下を確認すること:

- [ ] エラー発生時に状態がリセットされるか
- [ ] 正常完了時のリセットタイミングは適切か（即座 or 別条件）
- [ ] 非同期処理の場合、Promiseの完了を待ってからリセットしているか
- [ ] `void` で呼び出される async 関数の場合、内部で `catch` して例外を握りつぶしているか

## eslint-rule

ESLint化不可（状態管理のパターンは文脈依存であり、静的解析で正誤を判断できない。PRレビューで確認）
