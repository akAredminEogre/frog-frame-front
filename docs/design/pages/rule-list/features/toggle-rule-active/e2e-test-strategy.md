# toggle-rule-active E2Eテスト戦略

## 目的

ルール一覧画面でトグルスイッチを操作し、ルールの有効/無効切り替えがUIからDB永続化まで正しく動作することを、実ブラウザ環境で検証する。

## テストスコープ

### 対象フロー

1. ユーザーがポップアップからルールを保存する
2. ルール一覧ページでトグルスイッチをクリック
3. ルールの有効/無効が切り替わる（UI状態変化）
4. ページをリロードしても状態が維持される（DB永続化）

### 対象ページ

| ページ | URL | 役割 |
|-------|-----|------|
| ルール一覧 | `chrome-extension://{id}/rules.html` | トグル操作・状態確認 |
| ポップアップ | `chrome-extension://{id}/popup.html` | テストデータ（ルール）作成 |
| テストページ | `http://localhost:8080/agile-manifesto.html` | URL取得用 |

### 検証ポイント

| 観点 | 検証内容 | 検証方法 |
|------|---------|---------|
| UI状態変化 | トグル操作後に`data-selected`属性が変化 | `[data-selected]`属性の値を確認 |
| DB永続化 | ページリロード後もトグル状態が維持 | `rulesPage.reload()`後に状態確認 |
| 複数データ独立 | 他ルールのトグル状態に影響しない | 2つのルールを作成し片方のみ操作 |
| コンソールエラー | エラーが発生しないこと | `page.on('console')`で監視 |

## テスト分類

### 1. 正常操作フロー - 状態切り替え

トグルスイッチの基本操作が正しく動作することを検証する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| true → false | 有効なルールを無効に切り替え | 00-overview.md「有効/無効トグル」の基本パターン |
| false → true | 無効なルールを有効に切り替え | 00-overview.md「有効/無効トグル」の基本パターン |

### 2. 状態永続化 - DB保存

トグル状態がDBに正しく保存され、リロード後も維持されることを検証する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| リロード後維持 | ページリロード後もトグル状態が維持される | 00-overview.md「変更をDBに保存する」 |

### 3. 複数データ操作 - 独立性

複数ルールがある場合に、操作対象以外のルールに影響がないことを検証する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 他ルール不変 | 1つのルールをトグルしても他ルールは変化しない | データ独立性の保証 |

### 4. 競合防止

同一ルールへの連続操作が適切に制御されることを検証する。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 操作完了 | トグル操作が正常に完了する | 00-overview.md「競合状態の防止」 |

## ユーザーストーリートレーサビリティ

### 機能要件（00-overview.md参照）

| 機能要件 | テストケース | テストファイル |
|---------|-------------|---------------|
| トグル操作でルールの有効/無効を切り替える | true→false、false→true切り替え | toggle-rule-active.spec.ts |
| 変更をDBに保存する | リロード後もトグル状態が維持される | toggle-rule-active.spec.ts |

### 競合状態の防止（00-overview.md参照）

| 要件 | テストケース | テストファイル |
|-----|-------------|---------------|
| トグル処理中はトグルスイッチを操作不可にする | トグル操作が正常に完了する | toggle-rule-active.spec.ts |

### E2Eテストスコープ外

以下の項目は結合テストでカバーするため、E2Eテストでは検証しない：

| 項目 | 理由 |
|-----|------|
| ルール取得失敗時のエラー表示 | DBエラーは結合テストで検証 |
| ルール更新失敗時のエラー表示 | DBエラーは結合テストで検証 |
| タブリロード失敗時の部分的成功 | Chrome API依存のため結合テストで検証 |

## 網羅性チェック

- [x] 基本操作（true→false、false→true）
- [x] DB永続化（リロード後の状態維持）
- [x] 複数データの独立性
- [x] コンソールエラー監視
- [ ] エラーハンドリング → 結合テストでカバー
- [ ] 部分的成功 → 結合テストでカバー

## テストファイル構成

```
tests/e2e/pages/rule-list/features/toggle-rule-active/
└── toggle-rule-active.spec.ts    # トグル機能E2Eテスト
```

## テスト環境

### Playwright設定

- **ブラウザ**: Chromium（ヘッドレス）
- **拡張機能**: ビルド済み拡張機能をロード
- **タイムアウト**: 60000ms（拡張機能の初期化を考慮）

### テストページ

| ページ | パス | 用途 |
|-------|-----|------|
| agile-manifesto.html | `tests/e2e/test-pages/agile-manifesto.html` | ルール保存時のURL取得用 |

### ローカルHTTPサーバー

- **URL**: `http://localhost:8080`
- **ディレクトリ**: `tests/e2e/test-pages/`

## ヘルパー関数

### saveRule

```typescript
async function saveRule(
  popupPage: Page,
  page: Page,
  options: { oldString: string; newString: string; urlPattern?: string }
): Promise<void>
```

**使用目的**: ポップアップからルールを保存するテストデータ作成処理を共通化

### getToggleState

```typescript
async function getToggleState(rulesPage: Page, ruleIndex: number): Promise<boolean>
```

**使用目的**: トグルスイッチの現在状態（`data-selected`属性）を取得

### clickToggle

```typescript
async function clickToggle(rulesPage: Page, ruleIndex: number): Promise<void>
```

**使用目的**: 指定インデックスのトグルスイッチをクリック
