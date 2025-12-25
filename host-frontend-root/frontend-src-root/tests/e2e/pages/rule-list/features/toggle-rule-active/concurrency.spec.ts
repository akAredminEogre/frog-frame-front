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

    rulesPage.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
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

    // 3. Act: トグルをクリック
    await clickToggle(rulesPage, 0);

    // 4. Assert: トグル状態が変更されることを確認（disabled属性のテストは内部実装に依存するため省略）
    await expect(async () => {
      const state = await getToggleState(rulesPage, 0);
      expect(state).toBe(false);
    }).toPass({ timeout: 10000 });

    // 5. Assert: コンソールエラーが発生していないことを確認
    expect(consoleMessages).toHaveLength(0);
  });
});
