import type { Page } from '@playwright/test';
import { expect } from 'tests/e2e/fixtures';

// =============================================================================
// 定数
// =============================================================================

/**
 * テストサーバーのベースURL
 *
 * 環境変数 `TEST_SERVER_URL` で設定可能。未設定の場合はデフォルト値を使用。
 *
 * @example
 * // ローカル開発時
 * TEST_SERVER_URL=http://localhost:8080 npm run e2e
 *
 * // CI環境では自動的にデフォルト値が使用される
 */
export const TEST_SERVER_URL = process.env.TEST_SERVER_URL || 'http://localhost:8080';

/** ルールテーブル表示待機のタイムアウト（ms） */
export const RULES_TABLE_TIMEOUT = 60000;

/** 要素の表示・入力待機のデフォルトタイムアウト（ms） */
export const DEFAULT_TIMEOUT = 60000;

/** ダイアログ待機のタイムアウト（ms） */
export const DIALOG_TIMEOUT = 60000;

// =============================================================================
// コンソールエラー監視
// =============================================================================

/**
 * コンソールエラー監視をセットアップする
 *
 * 拡張機能のページ（popupPage, rulesPage）のコンソールエラーを監視する。
 * 通常のページ（page）は拡張機能コンテキスト外のため監視対象外。
 *
 * @param popupPage - ポップアップページ
 * @param rulesPage - ルール一覧ページ
 * @returns コンソールエラーメッセージを格納する配列
 */
export function setupConsoleErrorMonitoring(popupPage: Page, rulesPage: Page): string[] {
  const consoleMessages: string[] = [];

  popupPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[popup] ${msg.text()}`);
    }
  });
  rulesPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[rules] ${msg.text()}`);
    }
  });

  return consoleMessages;
}

/**
 * コンソールエラーが発生していないことを確認する
 *
 * @param consoleMessages - コンソールエラーメッセージの配列
 */
export function assertNoConsoleErrors(consoleMessages: string[]): void {
  expect(consoleMessages).toHaveLength(0);
}

// =============================================================================
// データベースクリーンアップ
// =============================================================================

/**
 * 全てのルールを削除する（テストデータのクリーンアップ用）
 *
 * IndexedDBの'FrogFrameFrontDatabase'データベースから全てのrewriteRulesを削除する。
 * テスト間のデータ独立性を確保するために使用する。
 * 削除後、ルール数が0件であることを検証する。
 *
 * @param rulesPage - ルール一覧ページ（Chrome拡張機能のコンテキストが必要）
 */
export async function clearAllRules(rulesPage: Page): Promise<void> {
  await rulesPage.evaluate(async () => {
    const request = indexedDB.open('FrogFrameFrontDatabase');
    return new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['rewriteRules'], 'readwrite');
        const store = transaction.objectStore('rewriteRules');
        store.clear();

        // トランザクション完了またはエラー時にDBをクローズ
        transaction.oncomplete = () => {
          // 削除後の件数を検証
          const verifyTransaction = db.transaction(['rewriteRules'], 'readonly');
          const verifyStore = verifyTransaction.objectStore('rewriteRules');
          const countRequest = verifyStore.count();

          countRequest.onsuccess = () => {
            const count = countRequest.result;
            db.close();
            if (count === 0) {
              resolve();
            } else {
              reject(new Error(`Failed to clear all rules: ${count} rules remain`));
            }
          };
          countRequest.onerror = () => {
            db.close();
            reject(new Error('Failed to verify rule count'));
          };
        };
        transaction.onerror = () => {
          db.close();
          reject(new Error('Failed to clear rewriteRules'));
        };
      };
      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };
    });
  });
}

// =============================================================================
// ページ操作ヘルパー
// =============================================================================

/**
 * ルール一覧ページをリロードしてテーブル表示を待機する
 *
 * @param rulesPage - ルール一覧ページ
 */
export async function reloadAndWaitForTable(rulesPage: Page): Promise<void> {
  await rulesPage.reload();
  await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: RULES_TABLE_TIMEOUT });
}

// =============================================================================
// ルール保存ヘルパー
// =============================================================================

/**
 * ルールをポップアップから保存する
 *
 * @param popupPage - ポップアップページ
 * @param page - テスト用HTMLページ
 * @param options - ルール設定オプション
 * @param options.oldString - 置換前の文字列
 * @param options.newString - 置換後の文字列
 */
export async function saveRule(
  popupPage: Page,
  page: Page,
  options: {
    oldString: string;
    newString: string;
  }
): Promise<void> {
  // ローカルHTTPサーバー経由でHTMLファイルに移動
  const fixtureUrl = `${TEST_SERVER_URL}/agile-manifesto.html`;
  await page.goto(fixtureUrl);
  await page.bringToFront();

  // ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();

  // URLパターンの自動入力を待機
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue(TEST_SERVER_URL, { timeout: DEFAULT_TIMEOUT });

  // 置換設定の入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');

  await beforeInput.fill(options.oldString);
  await afterInput.fill(options.newString);

  // 保存ボタンクリック（正確なテキストマッチで「保存」ボタンを特定）
  const saveButton = popupPage.getByRole('button', { name: '保存', exact: true });
  await expect(saveButton).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await expect(saveButton).toBeEnabled({ timeout: DEFAULT_TIMEOUT });

  // ダイアログ待機と保存ボタンクリックを同時に実行
  const [dialog] = await Promise.all([
    popupPage.waitForEvent('dialog', { timeout: DIALOG_TIMEOUT }),
    saveButton.click(),
  ]);

  // ダイアログメッセージを確認して承諾
  expect(dialog.message()).toBe('保存して適用しました！');
  await dialog.accept();
}
