import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickConfirmDeleteButton,
  clickDeleteButton,
  getRuleCount,
  hasRuleWithOldString,
  reloadAndWaitForEmptyState,
  reloadAndWaitForTable,
  saveRule,
  setupConsoleErrorMonitoring,
  waitForConfirmDialog,
  waitForConfirmDialogClosed,
  waitForRuleCount,
} from 'tests/e2e/pages/rule-list/features/delete-rule/helpers';

/**
 * ルール削除機能 - DB永続化のE2Eテスト
 *
 * ページリロード後も削除されたルールが復活しないことを検証する。
 * これにより、削除がDBに正しく永続化されていることを確認する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - DB永続化', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  test('削除後にページをリロードしてもルールが存在しない', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    const testOldString = '永続化テスト対象';
    await saveRule(popupPage, page, {
      oldString: testOldString,
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 初期状態で1件のルールが存在
    const initialCount = await getRuleCount(rulesPage);
    expect(initialCount).toBe(1);

    // 4. Act: ルールを削除
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 5. Assert: 削除直後は0件
    await waitForRuleCount(rulesPage, 0);

    // 6. Act: ページをリロード（ルール0件なので空状態メッセージを待機）
    await reloadAndWaitForEmptyState(rulesPage);

    // 7. Assert: リロード後も空状態が表示される（DBに永続化されている）
    // 空状態メッセージが表示されていることで、ルールが存在しないことを確認
    const emptyMessage = rulesPage.getByText('保存されたルールがありません');
    await expect(emptyMessage).toBeVisible();

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('複数回リロードしても削除状態が維持される', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: '複数リロードテスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: ルールを削除
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);
    await waitForRuleCount(rulesPage, 0);

    // 4. Act & Assert: 複数回リロードして状態を確認（ルール0件なので空状態メッセージを待機）
    for (let i = 0; i < 3; i++) {
      await reloadAndWaitForEmptyState(rulesPage);
      // 空状態メッセージが表示されていることで、ルールが存在しないことを確認
      const emptyMessage = rulesPage.getByText('保存されたルールがありません');
      await expect(emptyMessage).toBeVisible();
    }

    // 5. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('削除後に新しいルールを追加しても削除したルールは復活しない', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: 1つ目のルールを保存
    const deletedRuleOldString = '削除されるルール';
    await saveRule(popupPage, page, {
      oldString: deletedRuleOldString,
      newString: '置換後1',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: 1つ目のルールを削除
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);
    await waitForRuleCount(rulesPage, 0);

    // 4. Act: 新しいルールを追加
    const newRuleOldString = '新しいルール';
    await saveRule(popupPage, page, {
      oldString: newRuleOldString,
      newString: '置換後2',
    });

    // 5. Act: ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 6. Assert: 新しいルールのみが存在（1件）
    const count = await getRuleCount(rulesPage);
    expect(count).toBe(1);

    // 7. Assert: 削除したルールは存在しない
    const deletedExists = await hasRuleWithOldString(rulesPage, deletedRuleOldString);
    expect(deletedExists).toBe(false);

    // 8. Assert: 新しいルールは存在する
    const newExists = await hasRuleWithOldString(rulesPage, newRuleOldString);
    expect(newExists).toBe(true);

    // 9. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
