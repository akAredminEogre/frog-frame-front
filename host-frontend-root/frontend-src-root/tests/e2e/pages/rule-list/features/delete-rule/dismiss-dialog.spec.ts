import type { Page } from '@playwright/test';
import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickDeleteButton,
  getRuleCount,
  getRuleOldString,
  reloadAndWaitForTable,
  saveRule,
  setupConsoleErrorMonitoring,
  waitForConfirmDialog,
  waitForConfirmDialogClosed,
} from 'tests/e2e/pages/rule-list/features/delete-rule/helpers';

/**
 * ルール削除機能 - ダイアログ閉じ操作のE2Eテスト
 *
 * Escapeキー・オーバーレイクリックでダイアログを閉じた場合、
 * ルールが削除されずに残ることを検証する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - ダイアログ閉じ操作', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  const dismissMethods = [
    {
      name: 'Escapeキー',
      dismiss: async (rulesPage: Page) => {
        await rulesPage.keyboard.press('Escape');
      },
    },
    {
      name: 'オーバーレイクリック',
      dismiss: async (rulesPage: Page) => {
        const overlay = rulesPage.locator(
          '[data-testid="confirm-dialog-overlay"]'
        );
        await expect(overlay).toBeVisible();
        await overlay.click({ position: { x: 10, y: 10 } });
      },
    },
  ];

  for (const { name, dismiss } of dismissMethods) {
    test(`${name}でダイアログを閉じるとルールが残る`, async ({
      page,
      popupPage,
      rulesPage,
    }) => {
      // コンソールエラー監視をセットアップ
      const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

      // 1. Arrange: ルールを保存
      const testOldString = `${name}テスト`;
      await saveRule(popupPage, page, {
        oldString: testOldString,
        newString: '置換後',
      });

      // 2. Arrange: ルール一覧ページをリロード
      await reloadAndWaitForTable(rulesPage);

      // 3. Act: ゴミ箱アイコンをクリック
      await clickDeleteButton(rulesPage, 0);
      await waitForConfirmDialog(rulesPage);

      // 4. Act: ダイアログを閉じる
      await dismiss(rulesPage);

      // 5. Assert: ダイアログが閉じる
      await waitForConfirmDialogClosed(rulesPage);

      // 6. Assert: ルールが残っている
      const count = await getRuleCount(rulesPage);
      expect(count).toBe(1);

      // 7. Assert: ルールの内容が変わっていない
      const oldString = await getRuleOldString(rulesPage, 0);
      expect(oldString).toBe(testOldString);

      // 8. Assert: コンソールエラーが発生していないことを確認
      assertNoConsoleErrors(consoleMessages);
    });
  }
});
