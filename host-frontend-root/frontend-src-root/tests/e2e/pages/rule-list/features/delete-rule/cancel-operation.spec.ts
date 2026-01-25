import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickCancelButton,
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
 * ルール削除機能 - キャンセル操作のE2Eテスト
 *
 * 確認ダイアログで「キャンセル」を選択した場合、
 * ルールが削除されずに残ることを検証する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - キャンセル操作', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  test('確認ダイアログで「キャンセル」をクリックするとルールが残る', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    const testOldString = 'キャンセルテスト対象';
    await saveRule(popupPage, page, {
      oldString: testOldString,
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 初期状態で1件のルールが存在
    const initialCount = await getRuleCount(rulesPage);
    expect(initialCount).toBe(1);

    // 4. Assert: ルールのoldStringが正しいことを確認
    const oldString = await getRuleOldString(rulesPage, 0);
    expect(oldString).toBe(testOldString);

    // 5. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);

    // 6. Assert: 確認ダイアログが表示される
    await waitForConfirmDialog(rulesPage);

    // 7. Act: 「キャンセル」をクリック
    await clickCancelButton(rulesPage);

    // 8. Assert: ダイアログが閉じる
    await waitForConfirmDialogClosed(rulesPage);

    // 9. Assert: ルールが残っている（件数が変わらない）
    const finalCount = await getRuleCount(rulesPage);
    expect(finalCount).toBe(1);

    // 10. Assert: ルールの内容が変わっていない
    const finalOldString = await getRuleOldString(rulesPage, 0);
    expect(finalOldString).toBe(testOldString);

    // 11. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('キャンセル後も削除ボタンを再度クリックできる', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: '再クリックテスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: 1回目の削除操作 - キャンセル
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 4. Assert: ルールが残っている
    let count = await getRuleCount(rulesPage);
    expect(count).toBe(1);

    // 5. Act: 2回目の削除操作 - 再度ダイアログを開く
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 6. Assert: 2回目も確認ダイアログが正常に表示される
    const dialog = rulesPage.locator('[data-testid="confirm-dialog"]');
    await expect(dialog).toBeVisible();

    // 7. Cleanup: キャンセルして終了
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('Escapeキーでダイアログを閉じるとルールが残る', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    const testOldString = 'Escapeキーテスト';
    await saveRule(popupPage, page, {
      oldString: testOldString,
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 4. Act: Escapeキーを押す
    await rulesPage.keyboard.press('Escape');

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

  test('オーバーレイクリックでダイアログを閉じるとルールが残る', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    const testOldString = 'オーバーレイクリックテスト';
    await saveRule(popupPage, page, {
      oldString: testOldString,
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 4. Act: オーバーレイ（ダイアログ外側）をクリック
    // ConfirmDialogのオーバーレイはdata-testid="confirm-dialog-overlay"を持つ
    const overlay = rulesPage.locator('[data-testid="confirm-dialog-overlay"]');
    await overlay.click({ position: { x: 10, y: 10 } });

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
});
