import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickToggle,
  getToggleState,
  reloadAndWaitForTable,
  RULES_TABLE_TIMEOUT,
  saveRule,
  setupConsoleErrorMonitoring,
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

  test('素早い連続クリックでもエラーなく一貫した状態になる（競合防止）', async ({ page, popupPage, rulesPage }) => {
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
    // 連続クリック: 2つ目のクリックが処理されるかはタイミングに依存するため、
    // 特定の最終状態ではなく、データ整合性（UI状態とDB状態の一致）を検証する
    await clickToggle(rulesPage, 0);
    await clickToggle(rulesPage, 0);

    // 4. Assert: 連続クリック後のUI状態を取得（最終状態は検証しない）
    const uiState = await getToggleState(rulesPage, 0);

    // 5. Assert: ページをリロードしてDBの状態と一致することを確認（データ整合性）
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: RULES_TABLE_TIMEOUT });

    const persistedState = await getToggleState(rulesPage, 0);
    expect(persistedState).toBe(uiState);

    // 6. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
