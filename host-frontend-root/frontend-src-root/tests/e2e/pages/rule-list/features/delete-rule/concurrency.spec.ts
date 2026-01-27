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
 * ルール削除機能 - 重複削除防止・非同期処理のE2Eテスト
 *
 * 削除処理中の重複防止とUI非ブロッキングを検証する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - 重複削除防止・非同期処理', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  test('削除ボタンを素早く連続クリックしてもダイアログは1つだけ表示される', async ({
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

    // 3. Act: 削除ボタンを素早く2回クリック（ダイアログ表示を待たずに）
    // dispatchEventを使用することで、actionabilityチェックを回避し
    // オーバーレイ表示前に複数クリックをシミュレートする
    // 行にスコープしてから削除ボタンを取得（selector-rules.md セクション5準拠）
    const firstRow = rulesPage.locator('[data-testid="rules-table"] tbody tr').nth(0);
    const deleteButton = firstRow.locator('[data-testid="delete-button"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.dispatchEvent('click');
    await deleteButton.dispatchEvent('click');

    // 4. Assert: 確認ダイアログが表示される
    await waitForConfirmDialog(rulesPage);

    // 5. Assert: ダイアログは1つのみ（複数表示されていない）
    const dialogs = rulesPage.locator('[data-testid="confirm-dialog"]');
    await expect(dialogs).toHaveCount(1);

    // 6. Cleanup: ダイアログをキャンセルして閉じる
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 7. Assert: ルールは削除されていない
    const count = await getRuleCount(rulesPage);
    expect(count).toBe(1);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('削除確認ダイアログ表示中も他のルールの編集ボタンはdisabledにならない', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: 2つのルールを保存
    await saveRule(popupPage, page, {
      oldString: '削除対象ルール',
      newString: '置換後1',
    });

    await saveRule(popupPage, page, {
      oldString: '残るルール',
      newString: '置換後2',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 2件のルールが存在
    const initialCount = await getRuleCount(rulesPage);
    expect(initialCount).toBe(2);

    // 4. Act: 1つ目のルールの削除ボタンをクリックして確認ダイアログを表示
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 5. Assert: 2つ目のルールの編集ボタンはdisabledではない
    // （モーダルオーバーレイでブロックされているが、disabled属性は設定されていない）
    const secondEditButton = rulesPage.locator('[data-testid="edit-button"]').nth(1);
    await expect(secondEditButton).not.toBeDisabled();

    // 6. Act: 削除を確定
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 7. Assert: ルールが1件に減る
    await waitForRuleCount(rulesPage, 1);

    // 8. Assert: 残ったルールの編集ボタンがクリック可能（エラーなし）
    const remainingEditButton = rulesPage.locator('[data-testid="edit-button"]').first();
    await expect(remainingEditButton).toBeEnabled();

    // 9. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
