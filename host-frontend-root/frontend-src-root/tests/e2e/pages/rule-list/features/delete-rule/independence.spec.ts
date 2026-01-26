import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickConfirmDeleteButton,
  clickDeleteButton,
  getRuleCount,
  getRuleIndexByOldString,
  hasRuleWithOldString,
  reloadAndWaitForTable,
  saveRule,
  setupConsoleErrorMonitoring,
  waitForConfirmDialog,
  waitForConfirmDialogClosed,
  waitForRuleCount,
} from 'tests/e2e/pages/rule-list/features/delete-rule/helpers';

/**
 * ルール削除機能 - 複数ルール独立性のE2Eテスト
 *
 * 1つのルールを削除しても他のルールに影響がないことを検証する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - 複数ルール独立性', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  test('1つのルールを削除しても他のルールは残る', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: 2つのルールを保存
    const ruleAOldString = 'ルールA（削除対象）';
    const ruleBOldString = 'ルールB（残る）';

    await saveRule(popupPage, page, {
      oldString: ruleAOldString,
      newString: '置換後A',
    });

    await saveRule(popupPage, page, {
      oldString: ruleBOldString,
      newString: '置換後B',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 初期状態で2件のルールが存在
    const initialCount = await getRuleCount(rulesPage);
    expect(initialCount).toBe(2);

    // 4. Act: ルールAを削除
    const ruleAIndex = await getRuleIndexByOldString(rulesPage, ruleAOldString);
    expect(ruleAIndex).toBeGreaterThanOrEqual(0);

    await clickDeleteButton(rulesPage, ruleAIndex);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 5. Assert: 1件に減少
    await waitForRuleCount(rulesPage, 1);

    // 6. Assert: ルールAは存在しない
    const ruleAExists = await hasRuleWithOldString(rulesPage, ruleAOldString);
    expect(ruleAExists).toBe(false);

    // 7. Assert: ルールBは残っている
    const ruleBExists = await hasRuleWithOldString(rulesPage, ruleBOldString);
    expect(ruleBExists).toBe(true);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('削除後の件数表示が正しく更新される', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: 3つのルールを保存
    await saveRule(popupPage, page, {
      oldString: 'ルール1',
      newString: '置換後1',
    });

    await saveRule(popupPage, page, {
      oldString: 'ルール2',
      newString: '置換後2',
    });

    await saveRule(popupPage, page, {
      oldString: 'ルール3',
      newString: '置換後3',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 初期状態で3件
    expect(await getRuleCount(rulesPage)).toBe(3);

    // 4. Assert: フッターに「合計 3 件」と表示される
    const footer = rulesPage.locator('[data-testid="rules-footer"]');
    await expect(footer).toContainText('合計 3 件');

    // 5. Act: 1つ削除
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 6. Assert: 2件に減少
    await waitForRuleCount(rulesPage, 2);

    // 7. Assert: フッターに「合計 2 件」と表示される
    await expect(footer).toContainText('合計 2 件');

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('複数ルールを連続して削除できる', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: 3つのルールを保存
    await saveRule(popupPage, page, {
      oldString: '連続削除ルール1',
      newString: '置換後1',
    });

    await saveRule(popupPage, page, {
      oldString: '連続削除ルール2',
      newString: '置換後2',
    });

    await saveRule(popupPage, page, {
      oldString: '連続削除ルール3',
      newString: '置換後3',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 初期状態で3件
    expect(await getRuleCount(rulesPage)).toBe(3);

    // 4. Act: 1つ目を削除（常に0番目を削除）
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);
    await waitForRuleCount(rulesPage, 2);

    // 5. Act: 2つ目を削除
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);
    await waitForRuleCount(rulesPage, 1);

    // 6. Act: 3つ目を削除
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);
    await waitForRuleCount(rulesPage, 0);

    // 7. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('リロード後も削除されたルール以外は正しく表示される', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: 2つのルールを保存
    const deletedOldString = '削除されるルール';
    const remainingOldString = '残るルール';

    await saveRule(popupPage, page, {
      oldString: deletedOldString,
      newString: '置換後削除',
    });

    await saveRule(popupPage, page, {
      oldString: remainingOldString,
      newString: '置換後残る',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: 削除対象のルールを削除
    const deleteIndex = await getRuleIndexByOldString(rulesPage, deletedOldString);
    await clickDeleteButton(rulesPage, deleteIndex);
    await waitForConfirmDialog(rulesPage);
    await clickConfirmDeleteButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);
    await waitForRuleCount(rulesPage, 1);

    // 4. Act: ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 5. Assert: 残るルールのみが存在
    expect(await getRuleCount(rulesPage)).toBe(1);
    expect(await hasRuleWithOldString(rulesPage, remainingOldString)).toBe(true);
    expect(await hasRuleWithOldString(rulesPage, deletedOldString)).toBe(false);

    // 6. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
