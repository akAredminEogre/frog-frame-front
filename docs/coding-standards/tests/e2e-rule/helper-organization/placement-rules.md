# ヘルパー配置ルール

E2Eテストの共通定数・ヘルパー関数の配置ルール。

## 2層構造

E2Eテストのヘルパー・定数は**2層構造**で管理する：

1. **グローバル共通** (`tests/e2e/helpers.ts`)
   - 全E2Eテストで使用する汎用的な定数・ヘルパー
   - 例: タイムアウト値、ルール保存、テーブル待機など

2. **機能固有** (`tests/e2e/pages/{page}/features/{feature}/`)
   - 特定機能のテストでのみ使用する定数・ヘルパー
   - 例: 削除機能固有のダイアログ操作、ルール件数取得など

## ヘルパー配置の判断基準

| 条件 | 配置先 |
|------|--------|
| 複数の機能テストで使用される | `tests/e2e/helpers.ts` |
| 単一機能のテストでのみ使用される | 機能ディレクトリ内 |
| ページ共通だが機能横断的 | `tests/e2e/pages/{page}/helpers.ts`（必要に応じて作成） |

### 具体例：なぜその配置先なのか

| 定数名 | 配置先 | 理由 |
|--------|--------|------|
| `DEFAULT_TIMEOUT` | グローバル (`tests/e2e/helpers.ts`) | 要素待機の汎用タイムアウト。全機能のテストで共通して使用される |
| `DIALOG_TIMEOUT` | グローバル (`tests/e2e/helpers.ts`) | ダイアログ表示待機。削除・編集など複数機能で使用される |
| `CONFIRM_DIALOG_TIMEOUT` | 機能固有 (`delete-rule/constants.ts`) | 削除確認ダイアログ固有のタイムアウト。削除機能でのみ使用 |
| `TOGGLE_STATE_TIMEOUT` | 機能固有 (`toggle-rule-active/helpers.ts`) | トグル状態変更待機。有効/無効切替機能でのみ使用 |

**判断のポイント**：
- 「この定数/ヘルパーは他の機能テストでも使うか？」を自問する
- 今は1機能でしか使わなくても、将来的に汎用化が見込まれる場合はグローバルに配置
- 機能固有のUI要素（確認ダイアログ、トグルボタン等）に関するものは機能ディレクトリに配置

## 確認手順（必須）

新規E2Eテストファイル作成前に以下を確認：

```bash
# 1. グローバル共通ヘルパーを確認
cat tests/e2e/helpers.ts

# 2. 該当機能のヘルパーを確認（機能ディレクトリが存在する場合）
ls tests/e2e/pages/{page}/features/{feature}/
cat tests/e2e/pages/{page}/features/{feature}/helpers.ts  # 存在する場合
```

## グローバル共通定数（tests/e2e/helpers.ts）

| 定数名 | 値 | 用途 |
|--------|-----|------|
| `DEFAULT_TIMEOUT` | 60000 | 要素の表示・入力待機 |
| `RULES_TABLE_TIMEOUT` | 60000 | ルールテーブル表示待機 |
| `DIALOG_TIMEOUT` | 60000 | ダイアログ待機 |
| `TEST_SERVER_URL` | 環境変数または既定値 | テストサーバーのベースURL |

## グローバル共通ヘルパー関数（tests/e2e/helpers.ts）

| 関数名 | 用途 |
|--------|------|
| `setupConsoleErrorMonitoring` | コンソールエラー監視のセットアップ |
| `assertNoConsoleErrors` | コンソールエラーがないことの確認 |
| `clearAllRules` | 全ルール削除（テストデータクリーンアップ） |
| `reloadAndWaitForTable` | ページリロードしてテーブル表示を待機 |
| `saveRule` | ポップアップからルールを保存 |

## 機能固有ヘルパーの構成例

```plaintext
tests/e2e/pages/rule-list/features/delete-rule/
├── helpers.ts              # 再エクスポートモジュール（import経路の一本化）
├── constants.ts            # 機能固有の定数
├── dialog-operations.ts    # ダイアログ操作ヘルパー
└── rule-operations.ts      # ルールテーブル操作ヘルパー
```

機能固有ヘルパーが複数ファイルに分割される場合、`helpers.ts`で再エクスポートしてimport経路を一本化する。

## 例

```typescript
// ❌ 悪い例：グローバル共通定数と同じ値を重複定義
export const PAGE_LOAD_TIMEOUT = 60000;  // DEFAULT_TIMEOUTと重複

// ✅ 良い例：グローバル共通定数をインポートして使用
import { DEFAULT_TIMEOUT } from 'tests/e2e/helpers';

// ✅ 良い例：機能固有ヘルパーは機能ディレクトリの helpers.ts からインポート
import {
  clickDeleteButton,
  waitForConfirmDialog,
  CONFIRM_DIALOG_TIMEOUT,
} from 'tests/e2e/pages/rule-list/features/delete-rule/helpers';
```

## eslint-rule

ESLint化不可（定数の意味的な重複はコード静的解析では判定困難。PRレビューで確認）
