import { expect, test } from 'tests/e2e/fixtures';
import { clickToggle, getToggleState, saveRule } from 'tests/e2e/pages/rule-list/features/toggle-rule-active/helpers';

/**
 * ルールトグル機能 - 競合防止のE2Eテスト
 *
 * 同一ルールへの連続操作が適切に制御されることを検証する。
 *
 * @see docs/design/pages/rule-list/features/toggle-rule-active/e2e-test-strategy.md
 */
test.describe('ルールトグル機能 - 競合防止', () => {
  test('トグル処理中はトグルスイッチが操作不可になる（競合防止）', async ({ page, popupPage, rulesPage }) => {
    // コンソールエラーメッセージを記録するための配列
    const consoleMessages: string[] = [];

    // 拡張機能のページ（popupPage, rulesPage）のコンソールエラーを監視
    popupPage.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(`[popup] ${msg.text()}`);
      }
    });
    rulesPage.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(`[rules] ${msg.text()}`);
      }
    });

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: 'テスト文字列C',
      newString: '置換後文字列C',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

    // 3. Act: トグルを素早く2回クリック（競合状態のテスト）
    // 1回目のクリックの処理中に2回目がブロックされることを確認
    const toggleLabel = rulesPage.locator('label').filter({ has: rulesPage.locator('[data-selected]') }).nth(0);
    await Promise.all([
      toggleLabel.click(),
      toggleLabel.click(),
    ]);

    // 4. Assert: 素早い連続クリックでも最終状態が1回分の切り替えになることを確認
    // （2回トグルされていたら true に戻ってしまう）
    await expect(async () => {
      const state = await getToggleState(rulesPage, 0);
      expect(state).toBe(false);
    }).toPass({ timeout: 10000 });

    // 5. Assert: ページをリロードしても状態が維持されていることを確認（DB永続化）
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

    const persistedState = await getToggleState(rulesPage, 0);
    expect(persistedState).toBe(false);

    // 6. Assert: コンソールエラーが発生していないことを確認
    expect(consoleMessages).toHaveLength(0);
  });
});
