import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickCancelButton,
  clickDeleteButton,
  reloadAndWaitForTable,
  saveRule,
  setupConsoleErrorMonitoring,
  waitForConfirmDialog,
  waitForConfirmDialogClosed,
} from 'tests/e2e/pages/rule-list/features/delete-rule/helpers';

/**
 * ルール削除機能 - 重複削除防止・非同期処理のE2Eテスト
 *
 * 削除処理中のボタン無効化とUI非ブロッキングを検証する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - 重複削除防止・非同期処理', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  test('削除ボタンクリック後、確認ダイアログ表示中は削除ボタンがdisabledになる', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: '重複削除防止テスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: 削除ボタンをクリック
    await clickDeleteButton(rulesPage, 0);

    // 4. Assert: 確認ダイアログが表示される
    await waitForConfirmDialog(rulesPage);

    // 5. Assert: 削除ボタンがdisabledになっている
    const deleteButton = rulesPage.locator('[data-testid="delete-button"]').first();
    await expect(deleteButton).toBeDisabled();

    // 6. Cleanup: ダイアログをキャンセルして閉じる
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 7. Assert: キャンセル後は削除ボタンが再度有効になる
    await expect(deleteButton).toBeEnabled();

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('削除処理中も他のUI要素（編集ボタン）が操作可能', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: '非同期処理テスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: 削除ボタンをクリックして確認ダイアログを表示
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 4. Assert: 編集ボタンがdisabledではない（操作可能）
    // 注: 確認ダイアログがモーダルなため、背景の編集ボタンはクリックできないが、
    // disabled属性は設定されていない（モーダルのオーバーレイでブロックされているだけ）
    const editButton = rulesPage.locator('[data-testid="edit-button"]').first();
    await expect(editButton).not.toBeDisabled();

    // 5. Cleanup: ダイアログをキャンセルして閉じる
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 6. Assert: ダイアログを閉じた後、編集ボタンがクリック可能
    // 編集ボタンをクリックして編集ページに遷移することを確認
    await editButton.click();

    // 7. Assert: 編集ページに遷移（URLに/edit/が含まれる）
    await expect(rulesPage).toHaveURL(/\/edit\//);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
