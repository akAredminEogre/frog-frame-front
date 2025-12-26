import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clickToggle,
  getToggleState,
  reloadAndWaitForTable,
  saveRule,
  setupConsoleErrorMonitoring,
  waitForToggleState,
} from 'tests/e2e/pages/rule-list/features/toggle-rule-active/helpers';

/**
 * ルールトグル機能 - 正常操作フローのE2Eテスト
 *
 * トグルスイッチの基本操作が正しく動作し、状態がDBに永続化されることを検証する。
 *
 * @see docs/design/pages/rule-list/features/toggle-rule-active/e2e-test-strategy.md
 */
test.describe('ルールトグル機能 - 正常操作フロー', () => {
  test('有効なルールを無効に切り替えられる（isActive: true → false）', async ({ page, popupPage, rulesPage }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存（デフォルトでisActive=true）
    await saveRule(popupPage, page, {
      oldString: 'テスト文字列A',
      newString: '置換後文字列A',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: 初期状態でトグルがON（有効）であることを確認
    const initialState = await getToggleState(rulesPage, 0);
    expect(initialState).toBe(true);

    // 4. Act: トグルをクリックして無効に切り替え
    await clickToggle(rulesPage, 0);

    // 5. Assert: トグルがOFF（無効）になったことを確認
    await waitForToggleState(rulesPage, 0, false);

    // 6. Assert: ページをリロードしてもトグル状態が維持されていることを確認（DB永続化）
    await reloadAndWaitForTable(rulesPage);

    const persistedState = await getToggleState(rulesPage, 0);
    expect(persistedState).toBe(false);

    // 7. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('無効なルールを有効に切り替えられる（isActive: false → true）', async ({ page, popupPage, rulesPage }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: 'テスト文字列B',
      newString: '置換後文字列B',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Arrange: トグルをOFFにする（無効化）
    await clickToggle(rulesPage, 0);
    await waitForToggleState(rulesPage, 0, false);

    // 4. Act: トグルをクリックして有効に切り替え
    await clickToggle(rulesPage, 0);

    // 5. Assert: トグルがON（有効）になったことを確認
    await waitForToggleState(rulesPage, 0, true);

    // 6. Assert: ページをリロードしてもトグル状態が維持されていることを確認（DB永続化）
    await reloadAndWaitForTable(rulesPage);

    const persistedState = await getToggleState(rulesPage, 0);
    expect(persistedState).toBe(true);

    // 7. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
