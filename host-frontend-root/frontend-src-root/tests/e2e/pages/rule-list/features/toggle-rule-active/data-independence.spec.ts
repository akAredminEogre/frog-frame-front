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
 * ルールトグル機能 - 複数データ独立性のE2Eテスト
 *
 * 複数ルールがある場合に、操作対象以外のルールに影響がないことを検証する。
 *
 * @see docs/design/pages/rule-list/features/toggle-rule-active/e2e-test-strategy.md
 */
test.describe('ルールトグル機能 - 複数データ独立性', () => {
  /**
   * 複数ルールがある場合、他のルールのトグル状態に影響しないことを確認する。
   *
   * 注意: このテストはルールが作成順（ID昇順）で表示されることを前提としている。
   * index=0 が最初に作成したルール、index=1 が2番目に作成したルール。
   */
  test('複数ルールがある場合、他のルールのトグル状態に影響しない', async ({ page, popupPage, rulesPage }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: 1つ目のルールを保存
    await saveRule(popupPage, page, {
      oldString: 'ルール1の文字列',
      newString: 'ルール1の置換後',
    });

    // 2. Arrange: 2つ目のルールを保存
    await saveRule(popupPage, page, {
      oldString: 'ルール2の文字列',
      newString: 'ルール2の置換後',
    });

    // 3. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 4. Assert: 両方のルールが有効であることを確認
    // ルールは作成順（ID昇順）で表示される: index=0 が最初に作成したルール
    const initialState0 = await getToggleState(rulesPage, 0);
    const initialState1 = await getToggleState(rulesPage, 1);
    expect(initialState0).toBe(true);
    expect(initialState1).toBe(true);

    // 5. Act: 1つ目のルールのトグルをクリックして無効化
    await clickToggle(rulesPage, 0);

    // 6. Assert: 1つ目のルールが無効になり、2つ目のルールは有効のままであることを確認
    await waitForToggleState(rulesPage, 0, false);
    await waitForToggleState(rulesPage, 1, true);

    // 7. Assert: ページをリロードしても状態が維持されていることを確認
    await reloadAndWaitForTable(rulesPage);

    const persistedState0 = await getToggleState(rulesPage, 0);
    const persistedState1 = await getToggleState(rulesPage, 1);
    expect(persistedState0).toBe(false);
    expect(persistedState1).toBe(true);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
