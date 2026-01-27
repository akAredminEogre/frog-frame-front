import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickCancelButton,
  clickDeleteButton,
  reloadAndWaitForTable,
  saveRule,
  setupConsoleErrorMonitoring,
  waitForConfirmDialog,
  waitForConfirmDialogClosed,
} from 'tests/e2e/pages/rule-list/features/delete-rule/helpers';

/**
 * ルール削除機能 - アクセシビリティのE2Eテスト
 *
 * WAI-ARIA Dialog Modal Pattern（ADR-007）に準拠した
 * アクセシビリティ機能を検証する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - アクセシビリティ', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  test('Tabキーでフォーカスがダイアログ内でループする', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: 'フォーカストラップテスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 4. Assert: ダイアログ内のボタンを取得
    const cancelButton = rulesPage.locator('[data-testid="confirm-dialog-cancel-button"]');
    const confirmButton = rulesPage.locator('[data-testid="confirm-dialog-confirm-button"]');

    // 5. Assert: 初期フォーカスはキャンセルボタン（安全な選択肢）にある
    // フォーカス検証前に可視性を確認（描画タイミング差による失敗を切り分けやすくする）
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toBeFocused();

    // 6. Act: Tabキーを押してフォーカスを移動
    await rulesPage.keyboard.press('Tab');

    // 7. Assert: フォーカスが確認ボタンに移動
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toBeFocused();

    // 8. Act: もう一度Tabキーを押す
    await rulesPage.keyboard.press('Tab');

    // 9. Assert: フォーカスがキャンセルボタンにループして戻る（フォーカストラップ）
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toBeFocused();

    // 10. Cleanup: ダイアログを閉じる
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 11. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('Shift+Tabキーでフォーカスが逆方向にループする', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: '逆方向フォーカステスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 4. Assert: ダイアログ内のボタンを取得
    const cancelButton = rulesPage.locator('[data-testid="confirm-dialog-cancel-button"]');
    const confirmButton = rulesPage.locator('[data-testid="confirm-dialog-confirm-button"]');

    // 5. Assert: 初期フォーカスはキャンセルボタンにある
    // フォーカス検証前に可視性を確認（描画タイミング差による失敗を切り分けやすくする）
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toBeFocused();

    // 6. Act: Shift+Tabキーを押してフォーカスを逆方向に移動
    await rulesPage.keyboard.press('Shift+Tab');

    // 7. Assert: フォーカスが確認ボタンにループして移動（逆方向フォーカストラップ）
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toBeFocused();

    // 8. Act: もう一度Shift+Tabキーを押す
    await rulesPage.keyboard.press('Shift+Tab');

    // 9. Assert: フォーカスがキャンセルボタンに戻る
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toBeFocused();

    // 10. Cleanup: ダイアログを閉じる
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 11. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });

  test('ダイアログ表示中は背景スクロールが無効化される', async ({
    page,
    popupPage,
    rulesPage,
  }) => {
    // コンソールエラー監視をセットアップ
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

    // 1. Arrange: ルールを保存
    await saveRule(popupPage, page, {
      oldString: '背景スクロールテスト',
      newString: '置換後',
    });

    // 2. Arrange: ルール一覧ページをリロード
    await reloadAndWaitForTable(rulesPage);

    // 3. Assert: ダイアログ表示前はスクロール防止が適用されていない
    // usePreventScrollは環境によってhtmlまたはbodyにスタイルを適用するため両方チェック
    const overflowBefore = await rulesPage.evaluate(() => {
      const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      return { html: htmlOverflow, body: bodyOverflow };
    });
    expect(overflowBefore.html === 'hidden' || overflowBefore.body === 'hidden').toBe(false);

    // 4. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 5. Assert: ダイアログ表示中はスクロール防止が適用される
    const overflowDuring = await rulesPage.evaluate(() => {
      const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      return { html: htmlOverflow, body: bodyOverflow };
    });
    expect(overflowDuring.html === 'hidden' || overflowDuring.body === 'hidden').toBe(true);

    // 6. Act: ダイアログを閉じる
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 7. Assert: ダイアログを閉じた後はスクロール防止が解除される
    const overflowAfter = await rulesPage.evaluate(() => {
      const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      return { html: htmlOverflow, body: bodyOverflow };
    });
    expect(overflowAfter.html === 'hidden' || overflowAfter.body === 'hidden').toBe(false);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
