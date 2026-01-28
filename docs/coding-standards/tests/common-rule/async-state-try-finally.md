# 5. 非同期処理中のState排他制御（try/finally パターン）

### 規約

`Set` や `boolean` でUI上の処理中状態（`deletingIds`、`togglingIds` 等）を管理する場合、非同期処理の完了後にStateを解除するコードは `try/finally` で保護すること。

### 禁止事項

- 処理中 State に ID を追加した後、`try/finally` なしで `await` し、その後に State から ID を削除すること: 例外時に State が残留し、同一 ID の再操作が永久にブロックされる

### 許可事項

- 処理中 State への追加後、`try` ブロック内で `await` し、`finally` ブロックで State から ID を削除すること: 例外時も State が解除される

### 根拠

`await` の前に確保し `await` の後に解放するリソースがある場合、例外発生時に解放処理に到達せずリソースがリークする。これは `lock/unlock`、`open/close`、`add/remove` すべてに共通するパターン。

### 適用シナリオ

- 削除中ルール ID を `deletingIds` で管理し、`deleteRule()` を `await` する場合: `try/finally` で `deletingIds` からの削除を保証する

## eslint-rule

ESLint化不可（State管理のパターンを文脈判断する必要があるため。PRレビューで確認）
