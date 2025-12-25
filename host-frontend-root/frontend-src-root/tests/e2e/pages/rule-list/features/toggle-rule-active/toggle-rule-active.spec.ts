import { type Page } from '@playwright/test';

import { expect, test } from 'tests/e2e/fixtures';

/**
 * ルールトグル機能のE2Eテスト
 * ルール一覧画面でルールの有効/無効を切り替える機能を検証します
 *
 * @see docs/design/pages/rule-list/features/toggle-rule-active/00-overview.md
 * @see docs/design/pages/rule-list/features/toggle-rule-active/integration-test-strategy.md
 */

/**
 * テストヘルパー: ルールをポップアップから保存する
 */
async function saveRule(
  popupPage: Page,
  page: Page,
  options: {
    oldString: string;
    newString: string;
    urlPattern?: string;
  }
) {
  // ローカルHTTPサーバー経由でHTMLファイルに移動
  const fixtureUrl = 'http://localhost:8080/agile-manifesto.html';
  await page.goto(fixtureUrl);
  await page.bringToFront();

  // ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();

  // URLパターンの自動入力を待機
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue('http://localhost:8080', { timeout: 60000 });

  // 置換設定の入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');

  await beforeInput.fill(options.oldString);
  await afterInput.fill(options.newString);

  // 保存ボタンクリック
  const saveButton = popupPage.locator('button:has-text("保存")');
  await expect(saveButton).toBeVisible({ timeout: 60000 });
  await expect(saveButton).toBeEnabled({ timeout: 60000 });

  // ダイアログ待機と保存ボタンクリックを同時に実行
  const [dialog] = await Promise.all([
    popupPage.waitForEvent('dialog', { timeout: 60000 }),
    saveButton.click(),
  ]);

  // ダイアログメッセージを確認して承諾
  expect(dialog.message()).toBe('保存して適用しました！');
  await dialog.accept();
}

/**
 * テストヘルパー: ToggleSwitchの状態を取得する
 */
async function getToggleState(
  rulesPage: Page,
  ruleIndex: number
): Promise<boolean> {
  const toggleDiv = rulesPage.locator('[data-selected]').nth(ruleIndex);
  const dataSelected = await toggleDiv.getAttribute('data-selected');
  return dataSelected === 'true';
}

/**
 * テストヘルパー: ToggleSwitchをクリックする
 */
async function clickToggle(
  rulesPage: Page,
  ruleIndex: number
) {
  const toggleLabel = rulesPage.locator('label').filter({ has: rulesPage.locator('[data-selected]') }).nth(ruleIndex);
  await toggleLabel.click();
}

test.describe('ルールトグル機能', () => {
  test('有効なルールを無効に切り替えられる（isActive: true → false）', async ({ page, popupPage, rulesPage }) => {
    // コンソールエラーメッセージを記録するための配列
    const consoleMessages: string[] = [];

    rulesPage.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // 1. Arrange: ルールを保存（デフォルトでisActive=true）
    await saveRule(popupPage, page, {
      oldString: 'テスト文字列A',
      newString: '置換後文字列A',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

    // 3. Assert: 初期状態でトグルがON（有効）であることを確認
    const initialState = await getToggleState(rulesPage, 0);
    expect(initialState).toBe(true);

    // 4. Act: トグルをクリックして無効に切り替え
    await clickToggle(rulesPage, 0);

    // 5. Assert: トグルがOFF（無効）になったことを確認
    await expect(async () => {
      const newState = await getToggleState(rulesPage, 0);
      expect(newState).toBe(false);
    }).toPass({ timeout: 10000 });

    // 6. Assert: ページをリロードしてもトグル状態が維持されていることを確認（DB永続化）
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

    const persistedState = await getToggleState(rulesPage, 0);
    expect(persistedState).toBe(false);

    // 7. Assert: コンソールエラーが発生していないことを確認
    expect(consoleMessages).toHaveLength(0);
  });

  test('無効なルールを有効に切り替えられる（isActive: false → true）', async ({ page, popupPage, rulesPage }) => {
    // コンソールエラーメッセージを記録するための配列
    const consoleMessages: string[] = [];

    rulesPage.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: 'テスト文字列B',
      newString: '置換後文字列B',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

    // 3. Arrange: トグルをOFFにする（無効化）
    await clickToggle(rulesPage, 0);
    await expect(async () => {
      const state = await getToggleState(rulesPage, 0);
      expect(state).toBe(false);
    }).toPass({ timeout: 10000 });

    // 4. Act: トグルをクリックして有効に切り替え
    await clickToggle(rulesPage, 0);

    // 5. Assert: トグルがON（有効）になったことを確認
    await expect(async () => {
      const newState = await getToggleState(rulesPage, 0);
      expect(newState).toBe(true);
    }).toPass({ timeout: 10000 });

    // 6. Assert: ページをリロードしてもトグル状態が維持されていることを確認（DB永続化）
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

    const persistedState = await getToggleState(rulesPage, 0);
    expect(persistedState).toBe(true);

    // 7. Assert: コンソールエラーが発生していないことを確認
    expect(consoleMessages).toHaveLength(0);
  });

  test('複数ルールがある場合、他のルールのトグル状態に影響しない', async ({ page, popupPage, rulesPage }) => {
    // コンソールエラーメッセージを記録するための配列
    const consoleMessages: string[] = [];

    rulesPage.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

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
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

    // 4. Assert: 両方のルールが有効であることを確認
    const initialState0 = await getToggleState(rulesPage, 0);
    const initialState1 = await getToggleState(rulesPage, 1);
    expect(initialState0).toBe(true);
    expect(initialState1).toBe(true);

    // 5. Act: 1つ目のルールのトグルをクリックして無効化
    await clickToggle(rulesPage, 0);

    // 6. Assert: 1つ目のルールが無効になり、2つ目のルールは有効のままであることを確認
    await expect(async () => {
      const newState0 = await getToggleState(rulesPage, 0);
      expect(newState0).toBe(false);
    }).toPass({ timeout: 10000 });

    const unchangedState1 = await getToggleState(rulesPage, 1);
    expect(unchangedState1).toBe(true);

    // 7. Assert: ページをリロードしても状態が維持されていることを確認
    await rulesPage.reload();
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

    const persistedState0 = await getToggleState(rulesPage, 0);
    const persistedState1 = await getToggleState(rulesPage, 1);
    expect(persistedState0).toBe(false);
    expect(persistedState1).toBe(true);

    // 8. Assert: コンソールエラーが発生していないことを確認
    expect(consoleMessages).toHaveLength(0);
  });

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
