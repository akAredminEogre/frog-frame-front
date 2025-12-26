import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  getToggleState,
  reloadAndWaitForTable,
  RULES_TABLE_TIMEOUT,
  saveRule,
  setupConsoleErrorMonitoring,
  waitForToggleState,
} from 'tests/e2e/pages/rule-list/features/toggle-rule-active/helpers';

/**
 * ルールトグル機能 - 競合防止のE2Eテスト
 *
 * 同一ルールへの連続操作が適切に制御されることを検証する。
 *
 * @see docs/design/pages/rule-list/features/toggle-rule-active/e2e-test-strategy.md
 */
test.describe('ルールトグル機能 - 競合防止', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  test('素早い連続クリックでも1回分の切り替えのみが適用される（競合防止）', async ({ page, popupPage, rulesPage }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: 'テスト文字列C',
      newString: '置換後文字列C',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: トグルを素早く2回クリック（競合状態のテスト）
    // awaitなしで連続クリックすることで、1回目の処理中に2回目がブロックされることを確認
    const toggleDataSelected = rulesPage.locator('[data-selected]');
    const toggleLabel = rulesPage.locator('label').filter({ has: toggleDataSelected }).nth(0);
    // 連続クリック: 1回目のクリック完了を待たずに2回目をトリガー
    void toggleLabel.click();
    await toggleLabel.click();

    // 4. Assert: 素早い連続クリックでも最終状態が1回分の切り替えになることを確認
    // （2回トグルされていたら true に戻ってしまう）
    await waitForToggleState(rulesPage, 0, false);

    // 5. Assert: ページをリロードしても状態が維持されていることを確認（DB永続化）
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: RULES_TABLE_TIMEOUT });

    const persistedState = await getToggleState(rulesPage, 0);
    expect(persistedState).toBe(false);

    // 6. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
