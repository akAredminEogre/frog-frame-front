# issue-008: Playwrightバージョンアップ実装計画

## 概要
コンテナにインストールされているPlaywrightを最新バージョンにアップデートし、既存のe2eテストが正常に動作することを確認する。

## 現在の状況
- **現在のPlaywrightバージョン**: `@playwright/test`: `^1.53.1`
- **既存のe2eテスト**: `e2e/popup.spec.ts` (Chrome拡張のポップアップテスト)
- **設定ファイル**: `playwright.config.ts` で適切に設定済み
- **Docker環境**: Dockerfileで `npm install -D @playwright/test` と `npx playwright install --with-deps chromium` を実行

## 実装手順

### Phase 1: バージョン調査と更新準備
1. **最新バージョンの確認**
   ```bash
   cd ~/absolute-path/to/favorite-keyword-link-frog && docker compose exec frontend npm show @playwright/test version
   ```
   - npmで`@playwright/test`の最新バージョンを調査
   - 破壊的変更やリリースノートを確認

2. **package.jsonの更新**
   - `@playwright/test`を最新バージョンに更新
   - `npm install`でpackage-lock.jsonを再生成

### Phase 2: Dockerfileの確認と更新
1. **現在のDockerfileの確認**
   - Playwrightインストール部分の確認
   - 必要に応じてインストールコマンドの調整

2. **依存関係の確認**
   - Chromium用のapt依存関係が最新バージョンに対応しているか確認

### Phase 3: ローカルでのテスト実行と修正
1. **Dockerコンテナの再ビルド**
   ```bash
   cd ~/absolute-path/to/favorite-keyword-link-frog && docker compose build --no-cache
   ```

2. **e2eテストの実行**
   ```bash
   cd ~/absolute-path/to/favorite-keyword-link-frog && docker compose exec frontend npm run test:e2e
   ```
   - 既存のe2eテスト（popup.spec.ts）を実行
   - エラーや警告の確認

3. **必要最小限の修正**
   - バージョンアップによる影響があった場合のみ修正
   - テスト仕様は変更せず、実装部分のみ調整
   - 想定される修正点：
     - API変更による構文修正
     - 設定ファイルの調整
     - デバイス設定の更新

### Phase 4: 最終動作確認
1. **Docker環境での完全なテスト実行**
   - コンテナ内でのe2eテスト実行
   - ビルドプロセスの確認
   - 拡張機能の動作確認

2. **回帰テストの実行**
   - 既存の全てのテスト（unit test + e2e test）を実行
   - 問題がないことを確認

## 想定されるリスク と対策

### 1. APIの破壊的変更
**リスク**: Playwrightの新バージョンでAPI変更があった場合
**対策**: 
- 最小限の修正で対応
- 公式のマイグレーションガイドに従う
- テスト仕様は変更しない

### 2. ブラウザ依存関係の変更
**リスク**: Chromiumのバージョンや依存関係の変更
**対策**: 
- Dockerfileのapt依存関係を必要に応じて調整
- `--with-deps`オプションで必要な依存関係を自動インストール

### 3. パフォーマンスの変化
**リスク**: 新バージョンでテスト実行時間が変わる可能性
**対策**: 
- タイムアウト設定の見直し
- 必要に応じてplaywright.config.tsの調整

## 受け入れ条件の確認

- [x] Playwrightのバージョンが最新になっていること → 1.54.1に更新完了（2025/07/30）
- [x] その変更がDockerfileやpackage.jsonに反映されて永続化されていること → package.json更新完了（2025/07/30）
- [x] 既存のe2eテストがすべて通過すること → 1 passed (4.5s)で確認完了（2025/07/30）

## 成果物

1. **更新されたpackage.json** - 最新のPlaywrightバージョン
2. **更新されたpackage-lock.json** - 依存関係の固定
3. **更新されたDockerfile** - 必要に応じて
4. **動作確認済みのe2eテスト** - 回帰なし
5. **実装記録** - 実際に行った変更の詳細

## 注意事項

- テスト仕様自体には変更を加えない
- Playwrightのバージョンアップの影響を受ける箇所のみ、変更を最小限に留める
- 既存の機能に影響を与えないことを最優先とする
- Dockerコンテナの再ビルドが必要となる可能性がある

## 実装優先度

1. **High**: package.jsonの更新とDockerfileの確認
2. **High**: e2eテストの動作確認
3. **Medium**: 設定ファイルの調整（必要に応じて）
4. **Low**: パフォーマンス最適化（問題があった場合のみ）
