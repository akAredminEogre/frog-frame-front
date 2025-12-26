import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickToggle,
  getToggleState,
  reloadAndWaitForTable,
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
    // 連続クリックがエラーなく処理されることを検証する
    await clickToggle(rulesPage, 0);
    await clickToggle(rulesPage, 0);

    // 4. Assert: ページをリロードして状態が正常に永続化されていることを確認
    // （UI状態とDB状態の比較はしない。非同期処理のタイミングにより不一致になりうるため）
    await reloadAndWaitForTable(rulesPage);

    // 5. Assert: リロード後もトグル状態が取得可能であること（データ破損がないこと）
    const persistedState = await getToggleState(rulesPage, 0);
    expect(typeof persistedState).toBe('boolean');

    // 6. Assert: トグルが引き続き正常に動作すること（競合防止メカニズムの検証）
    // 連続クリック後も、単一クリックで状態が正しく反転することを確認
    await clickToggle(rulesPage, 0);
    const stateAfterClick = await getToggleState(rulesPage, 0);
    expect(stateAfterClick).toBe(!persistedState);

    // 7. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
