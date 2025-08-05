# issue-011 e2eテスト実装計画

## 概要
アジャイルソフトウェア開発宣言のページでDOM置換機能をテストするe2eテストを`save-and-replace.spec.ts`に実装する。

## 実装方針

### 1. テスト構造の設計
`get-origin.spec.ts`の実装パターンを参考に、以下の流れでテストを実装する：

1. **Arrange**: テスト対象ページへの移動とDOM要素の確認
2. **Act**: ポップアップでの操作（フォーム入力、保存ボタンクリック）
3. **Assert**: DOM置換結果とモーダル表示の確認

### 2. 具体的な実装ステップ

#### Step 1: テスト環境のセットアップ
- `fixtures.ts`の現在の実装で十分対応可能
- `page`, `popupPage`, `context`を利用
- タイムアウト設定は既存テストと同様に10秒を基準とする

#### Step 2: テストケースの実装
```typescript
test('DOM置換機能のe2eテスト', async ({ page, popupPage }) => {
  // 1. Arrange: テスト対象ページに移動
  await page.goto('https://agilemanifesto.org/iso/ja/manifesto.html');
  await page.bringToFront();
  
  // 初期DOM要素の存在確認
  await expect(page.locator('h1')).toHaveText('アジャイルソフトウェア開発宣言');
  
  // 2. ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();
  
  // 3. URLパターンの自動入力確認（既存機能のテスト）
  const urlPatternInput = popupPage.getByLabel('URLパターン (前方一致):');
  await expect(urlPatternInput).toHaveValue('https://agilemanifesto.org', { timeout: 10000 });
  
  // 4. Act: 置換設定の入力
  const beforeInput = popupPage.getByLabel('置換前：');
  const afterInput = popupPage.getByLabel('置換後：');
  const regexCheckbox = popupPage.getByLabel('正規表現を使う');
  
  await beforeInput.fill('<h1>(.+?)</h1>');
  await afterInput.fill('<h2>$1</h2>');
  await regexCheckbox.check(); // 正規表現を使うにチェックを入れる
  
  // 5. 保存ボタンクリック
  const saveButton = popupPage.getByRole('button', { name: '保存' });
  await saveButton.click();
  
  // 6. Assert: モーダル表示の確認
  await expect(popupPage.locator('text=保存して適用しました！')).toBeVisible({ timeout: 5000 });
  
  // 7. Assert: DOM置換結果の確認
  await expect(page.locator('h2')).toHaveText('アジャイルソフトウェア開発宣言', { timeout: 10000 });
  await expect(page.locator('h1')).toHaveCount(0); // h1要素が存在しないことを確認
});
```

#### Step 3: エラーハンドリングと安定性の向上
- 適切なタイムアウト設定
- DOM要素の待機処理
- テスト実行順序の考慮

### 3. 実装時の注意点

#### 3.1 既存コードとの整合性
- `get-origin.spec.ts`と同様のパターンを踏襲
- fixtures.tsの現在の実装を活用
- テスト名は要件に合わせて明確に設定

#### 3.2 DOM要素の特定方法
- ラベルテキストでの要素特定: `getByLabel()`
- ロールでの要素特定: `getByRole()`
- テキストコンテンツでの特定: `locator('text=...')`

#### 3.3 タイミング制御
- `page.bringToFront()`でページフォーカス
- `popupPage.reload()`で最新状態を取得
- 適切な`timeout`オプション設定

### 4. テスト実行フロー

#### 4.1 事前確認
```bash
cd ~/akAredminEogre-project/favorite-keyword-link-frog && docker compose exec frontend npm run test:e2e
```

#### 4.2 実装後のテスト実行
1. 新しいテストケースの実行確認
2. 既存のe2eテスト（`get-origin.spec.ts`等）が引き続き通ることを確認

### 5. 予想される技術的課題と対策

#### 5.1 DOM置換のタイミング
- **課題**: DOM置換が非同期で実行されるため、置換完了の待機が必要
- **対策**: `expect().toHaveText()`の`timeout`オプションを活用

#### 5.2 モーダル表示の確認
- **課題**: モーダルの表示タイミングとテキスト内容の特定
- **対策**: `toBeVisible()`でモーダルの表示を確認し、適切なセレクターを使用

#### 5.3 Chrome拡張機能の状態管理
- **課題**: 拡張機能の内部状態がテスト間で影響する可能性
- **対策**: 各テストで独立したコンテキストを使用（fixtures.tsで保証済み）

### 6. 成果物

#### 6.1 修正対象ファイル
- `host-frontend-root/frontend-src-root/e2e/save-and-replace.spec.ts`
  - 現在のコメントアウトされたサンプルコードを削除
  - 新しいテストケースを実装

#### 6.2 fixtures.tsの修正要否
- 現在の実装で十分対応可能
- 追加の修正は不要と判断

### 7. 実装順序

- [x] **Phase 1**: `save-and-replace.spec.ts`の既存コメント削除と基本構造実装
- [x] **Phase 2**: テストケースの詳細実装（DOM確認、フォーム操作）
- [x] **Phase 3**: Assert部分の実装（モーダル確認、DOM置換確認）
- [x] **Phase 4**: テスト実行と動作確認
- [x] **Phase 5**: 既存テストとの整合性確認

### 8. 実装完了チェックリスト

- [x] save-and-replace.spec.tsの既存コメント削除
- [x] DOM置換機能のe2eテスト実装
- [x] agilemanifesto.orgページでのテスト実行
- [x] フォーム操作の実装（URLパターン、置換前後の入力）
- [x] 保存ボタンクリックの実装
- [x] DOM状態確認のデバッグ機能追加
- [x] 全テスト通過確認（3 passed）
- [x] 既存テストとの整合性確認
- [x] PROGRESS-01.mdでの進捗報告
- [x] ユーザーレビュー完了

### 8. リスク管理

#### 8.1 高リスク要因
- 外部サイト（agilemanifesto.org）への依存
- Chrome拡張機能の非同期処理

#### 8.2 リスク軽減策
- タイムアウト設定の適切な調整
- 段階的なAssert実装で問題箇所の特定を容易化

この計画に基づいて実装を進めることで、要求仕様を満たすe2eテストを効率的に実装できる見込みです。
