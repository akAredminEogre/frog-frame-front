# ISSUE-117 PULL REQUEST

## タイトル
feat: importをアルファベット順にソートするnpmパッケージの導入とimport順序管理機能の実装

## 概要と理由

### 概要
`eslint-plugin-simple-import-sort`を導入し、importをアルファベット順にソートする機能を実装しました。また、プロジェクト固有の要件（DI初期化順序の制約）に対応するため、カスタムグループ設定と統合テストを追加しました。

### 理由
- コードの可読性向上: import順序を統一することで、ファイルの先頭部分が整理され、依存関係が把握しやすくなる
- メンテナンス性向上: 新しいimportを追加する際に、どこに配置すべきか迷わない
- レビュー効率化: import順序の違いによるレビューコメントを削減
- DI初期化の安全性確保: reflect-metadataの初期化順序を保証する仕組みを構築

## 主な変更点

### 1. eslint-plugin-simple-import-sortの導入とカスタム設定（スクラム01）
- `eslint-plugin-simple-import-sort`をインストール
- `eslint.config.js`にカスタムグループ設定を追加
  - DI container（`src/infrastructure/di/container`）を最優先
  - Side effect imports（`reflect-metadata`等）
  - Node.js builtins
  - External packages
  - Internal packages（`src/`）
  - Relative imports（`../`, `./`）
- E2Eテスト失敗の原因究明とDI初期化順序の修正
- 全ファイル（約150ファイル）のimportをソート

### 2. DI初期化問題の調査と統合テストの追加（スクラム02）
- **原因調査とドキュメント化**
  - ユニットテストとE2Eテストの違いを分析
  - `CLAUDE.md`に「CRITICAL - Import Order Constraint」セクションを追加
- **統合テストの実装**
  - `tests/integration/entrypoints/background-initialization.test.ts`を作成
  - エントリーポイントからリスナーまでの実際のimport順序を再現
  - E2Eテストより軽量で高速（数百ミリ秒で完了）

### 3. ESLint設定の段階的改善（スクラム02）
- **警告表示の最適化**
  - `eslint.config.js`: `simple-import-sort/imports`を`'warn'`に設定
  - `.vscode/settings.json`: VSCodeでの表示を情報レベル（青いインジケーター）に設定
- **importソート機能の追加**
  - `package.json`: `sort:imports`スクリプトを追加
  - `Makefile`: `make sortimports`コマンドを追加
  - 手動実行のみに制限（自動実行を防止）

### 4. テストコマンドでのimport sort制御（スクラム02）
- **`make testlint`での自動修正を無効化**
  - `package.json`: `lint:fix:no-sort`スクリプトを追加
  - `unused:fix`スクリプトを`lint:fix:no-sort`を使用するように変更
- **`make testcheck`での警告を非表示**
  - `package.json`: `lint:no-sort`スクリプトを追加
  - `test:check`スクリプトを`lint:no-sort`を使用するように変更

### 変更ファイル一覧

**ドキュメント:**
- `CLAUDE.md` - DI初期化の制約を文書化
- `docs/issue-117/PLAN.md` - タスク管理と進捗記録
- `docs/issue-117/RETROSPECTIVE.md` - スクラムの振り返り
- `.vscode/settings.json`（新規作成） - VSCodeでのESLint表示設定

**テスト:**
- `tests/integration/entrypoints/background-initialization.test.ts`（新規作成） - DI初期化の統合テスト

**設定ファイル:**
- `host-frontend-root/frontend-src-root/eslint.config.js` - simple-import-sortルールの設定
- `host-frontend-root/frontend-src-root/package.json` - lint/testスクリプトの追加・変更
  - `lint:no-sort` - import sort以外のルールでチェック
  - `lint:fix:no-sort` - import sort以外のルールで修正
  - `sort:imports` - 全ファイルのimportをソート
- `Makefile` - `make sortimports`コマンドの追加

**ソースコード:**
- 全ソースファイル（約150ファイル） - importをDIコンテナ優先順序でソート
  - `src/`配下の全TypeScript/Reactファイル
  - `tests/`配下の全テストファイル

## テスト方法

### 動作確認の手順
1. **回帰テストの実行**
   ```bash
   make testcheck
   ```
   - 既存の全ユニットテスト（269件）が成功することを確認
   - 既存の全E2Eテスト（12件）が成功することを確認
   - lint、knip、tsrがエラーなしで完了することを確認

2. **統合テストの確認**
   - `tests/integration/entrypoints/background-initialization.test.ts`が成功することを確認
   - DI初期化が正しく行われていることを検証

3. **import sortの動作確認**
   ```bash
   # 手動でimportをソート
   make sortimports

   # 変更がないことを確認（既にソート済み）
   git status
   ```

4. **VSCodeでの表示確認**
   - import順序が乱れているファイルを開く
   - 情報レベル（青いインジケーター）でヒントが表示されることを確認

### 期待される結果
- すべてのテストが成功（ユニット: 269件、E2E: 12件）
- import順序がDIコンテナ優先順序で統一されている
- `make testcheck`でimport sortの警告が表示されない
- `make testlint`でimport sortの自動修正が行われない
- VSCodeで情報レベルのヒントが表示される

## 補足

### import順序のルール
1. Side effect imports（`reflect-metadata`等）
2. DI container（`src/infrastructure/di/container`）- **最優先**
3. Node.js builtins（`node:*`）
4. External packages（`react`, `dexie`等）
5. Internal packages（`src/`で始まるパス）
6. Parent imports（`../`）
7. Current directory imports（`./`）

### 各コマンドの役割
- `npm run lint`: 全てのルールでチェック（import sort警告を含む）
- `npm run lint:no-sort`: import sort以外のルールでチェック
- `npm run lint:fix`: 全てのルールで修正（import sortを含む）
- `npm run lint:fix:no-sort`: import sort以外のルールで修正
- `npm run sort:imports`: 明示的にimportをソート
- `make sortimports`: Docker内で全ファイルのimportをソート
- `make testcheck`: テスト実行（import sort警告なし）
- `make testlint`: テスト実行と修正（import sort自動修正なし）

### DI初期化の制約について
- DIコンテナ（`src/infrastructure/di/container`）は、`@injectable()`デコレータを使用するクラスより先にimportする必要がある
- これは`reflect-metadata`の初期化タイミングに依存する制約
- 統合テスト（`tests/integration/entrypoints/background-initialization.test.ts`）で実際のアプリケーション起動フローを検証

### 開発者体験の配慮
- VSCodeでは情報レベルでヒント表示（警告ではない）
- `make sortimports`で明示的にimportをソート（手動実行のみ）
- `make testlint` / `make testcheck`ではimport sortを強制しない
- 開発者が柔軟に制御できる仕組みを構築

## 本スコープの対象外となったタスク

- **変更のあったファイルだけに対してimportソートを適用する機能**
  - `make sortimports-changed`として一度実装したが、複雑性を考慮してスコープ外とした
  - 本issueの主目的（importソート機能の導入）は達成済み
  - 将来の改善課題として残す

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
