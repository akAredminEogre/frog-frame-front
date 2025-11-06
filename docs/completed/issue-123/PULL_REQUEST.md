# ISSUE-123 相対パスimportを絶対パスimportに統一

## タイトル
refactor: Convert all relative imports to absolute imports with src/ prefix

## 概要と理由
コードベース内に残存していた相対パスimport（`../`、`./`）を、CLAUDE.mdで定義されているimportルールに従い、すべて`src/`から始まる絶対パスに統一しました。

さらに、今後の相対パスimportの使用を防止するため、ESLintプラグイン（`eslint-plugin-no-relative-import-paths`）を導入し、警告を表示する仕組みを構築しました。

**理由:**
- コードベースの可読性と保守性の向上
- importパスの一貫性を保つ
- CLAUDE.mdで定義されたコーディング規約への準拠
- 将来的な相対パスimportの混入を防止

## 主な変更点

### 1. 相対パスimportの絶対パスへの変換
- **対象ファイル数**: 45ファイル
  - `src/`配下: 36ファイル（コンポーネント、Storybook、ドメインエンティティ、インフラ、エントリーポイント）
  - `tests/e2e/`配下: 9ファイル（全E2Eテストファイル）

- **変換パターン例:**
  ```typescript
  // Before
  import { Title } from '../atoms/Title';
  import { RewriteRule } from './RewriteRule';

  // After
  import { Title } from 'src/components/atoms/Title';
  import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
  ```

- **注意点**: CSSモジュールimport（`.module.css`、`.css`）はアセットimportのため対象外

### 2. ESLintプラグインの導入
- **プラグイン**: `eslint-plugin-no-relative-import-paths@^1.5.5`
- **設定内容** (`eslint.config.js`):
  ```javascript
  'no-relative-import-paths/no-relative-import-paths': [
    'warn',
    {
      allowSameFolder: false,
      rootDir: 'src',
      prefix: 'src',
    },
  ]
  ```
- **効果**: 相対パスimportを使用すると警告が表示される（エラーではないためビルドはブロックしない）

### 3. プラグイン選定の経緯
- 当初`eslint-plugin-import`を検討したが、相対パスimport防止の包括的なルールが存在しないことを確認
- `eslint-plugin-no-relative-import-paths`を選定:
  - 相対パスimportを絶対パスに変換する機能
  - `--fix`オプションによる自動修正に対応
  - 設定オプションが充実（rootDir、prefix等）

## テスト方法
[動作確認の手順]
- `make testlint` で回帰テスト通過を確認
  - ✅ 267 unit tests passed
  - ✅ 12 E2E tests passed
  - ✅ Knip: no unused code detected
  - ✅ Linting: passed with warnings（CSS module importに対する警告は期待される動作）

## 補足
[追加の文脈や注意点]
- CSS module imports（`./Button.module.css`等）は相対パスのままです。これはアセットimportであり、絶対パスに変換する必要がないためです。
- ESLintはこれらのCSS importに対しても警告を表示しますが、これは無視して構いません。
- 今後、新しいTypeScript/JavaScriptファイルで相対パスimportを使用すると、ESLintが警告を表示します。

## 本スコープの対象外となったタスク
なし


<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
