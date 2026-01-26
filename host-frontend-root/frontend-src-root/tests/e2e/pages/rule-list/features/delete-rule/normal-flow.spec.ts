import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickCancelButton,
  clickConfirmDeleteButton,
  clickDeleteButton,
  getRuleCount,
  reloadAndWaitForTable,
  saveRule,
  setupConsoleErrorMonitoring,
  waitForConfirmDialog,
  waitForConfirmDialogClosed,
  waitForRuleCount,
} from 'tests/e2e/pages/rule-list/features/delete-rule/helpers';

/**
 * ルール削除機能 - 正常操作フローのE2Eテスト
 *
 * ゴミ箱アイコンクリック → 確認ダイアログ表示 → 削除 → 一覧から消える
 * という基本的な削除フローが正しく動作することを検証する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - 正常操作フロー', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  test('ゴミ箱アイコンをクリックすると確認ダイアログが表示される', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: 'ダイアログ表示テスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 初期状態で1件のルールが存在
    const initialCount = await getRuleCount(rulesPage);
    expect(initialCount).toBe(1);

    // 4. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);

    // 5. Assert: 確認ダイアログが表示される
    await waitForConfirmDialog(rulesPage);

    // 6. Assert: ダイアログのタイトルとメッセージが正しい
    const dialogTitle = rulesPage.locator('[data-testid="confirm-dialog"] h2, [data-testid="confirm-dialog"] [role="heading"]');
    await expect(dialogTitle).toContainText('ルールの削除');

    // 7. Cleanup: ダイアログをキャンセルして閉じる
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('確認ダイアログで「削除」をクリックするとルールが削除される', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: '削除テスト対象',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 初期状態で1件のルールが存在
    const initialCount = await getRuleCount(rulesPage);
    expect(initialCount).toBe(1);

    // 4. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);

    // 5. Act: 確認ダイアログで「削除」をクリック
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);

    // 6. Assert: ダイアログが閉じる
    await waitForConfirmDialogClosed(rulesPage);

    // 7. Assert: ルールが一覧から消える（0件になる）
    await waitForRuleCount(rulesPage, 0);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('削除後は空状態メッセージが表示される', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: '空状態テスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: ルールを削除
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 4. Assert: ルール件数が0になる
    await waitForRuleCount(rulesPage, 0);

    // 5. Assert: 空状態メッセージが表示される
    // EmptyStateMessageコンポーネントの表示をdata-testidで確認
    const emptyState = rulesPage.locator('[data-testid="empty-state"]');
    await expect(emptyState).toBeVisible();

    // 6. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
