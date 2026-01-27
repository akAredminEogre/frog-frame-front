import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  clickCancelButton,
  clickDeleteButton,
  getOverflowStyles,
  isScrollPrevented,
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
 * 注: フォーカストラップのテストは focus-trap.spec.ts に分離
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - アクセシビリティ', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
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
    const overflowBefore = await getOverflowStyles(rulesPage);
    expect(isScrollPrevented(overflowBefore)).toBe(false);

    // 4. Act: ゴミ箱アイコンをクリック
    await clickDeleteButton(rulesPage, 0);
    await waitForConfirmDialog(rulesPage);

    // 5. Assert: ダイアログ表示中はスクロール防止が適用される
    const overflowDuring = await getOverflowStyles(rulesPage);
    expect(isScrollPrevented(overflowDuring)).toBe(true);

    // 6. Act: ダイアログを閉じる
    await clickCancelButton(rulesPage);
    await waitForConfirmDialogClosed(rulesPage);

    // 7. Assert: ダイアログを閉じた後はスクロール防止が解除される
    const overflowAfter = await getOverflowStyles(rulesPage);
    expect(isScrollPrevented(overflowAfter)).toBe(false);

    // 8. Assert: コンソールエラーが発生していないことを確認
    assertNoConsoleErrors(consoleMessages);
  });
});
