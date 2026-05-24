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
 * ルール削除機能 - フォーカストラップのE2Eテスト
 *
 * WAI-ARIA Dialog Modal Pattern（ADR-007）に準拠した
 * フォーカストラップ機能を検証する。
 *
 * @see docs/design/pages/rule-list/features/delete-rule/e2e-test-strategy.md
 */

test.describe('ルール削除機能 - フォーカストラップ', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  // フォーカストラップのテストケース定義
  const focusTrapCases = [
    {
      name: 'Tabキーでフォーカスがダイアログ内でループする',
      oldString: 'フォーカストラップテスト',
      keySequence: ['Tab', 'Tab'],
      expectedFocusOrder: [
        'confirm-dialog-confirm-button', // 1回目のTab
        'confirm-dialog-cancel-button', // 2回目のTab（ループ）
      ],
    },
    {
      name: 'Shift+Tabキーでフォーカスが逆方向にループする',
      oldString: '逆方向フォーカステスト',
      keySequence: ['Shift+Tab', 'Shift+Tab'],
      expectedFocusOrder: [
        'confirm-dialog-confirm-button', // 1回目のShift+Tab（逆方向）
        'confirm-dialog-cancel-button', // 2回目のShift+Tab（ループして戻る）
      ],
    },
  ];

  focusTrapCases.forEach(({ name, oldString, keySequence, expectedFocusOrder }) => {
    test(name, async ({ page, popupPage, rulesPage }) => {
      // コンソールエラー監視をセットアップ
      const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

      // 1. Arrange: ルールを保存
      await saveRule(popupPage, page, {
        oldString,
        newString: '置換後',
      });

      // 2. Arrange: ルール一覧ページをリロード
      await reloadAndWaitForTable(rulesPage);

      // 3. Act: ゴミ箱アイコンをクリック
      await clickDeleteButton(rulesPage, 0);
      await waitForConfirmDialog(rulesPage);

      // 4. Assert: キャンセルボタンを取得
      const cancelButton = rulesPage.locator('[data-testid="confirm-dialog-cancel-button"]');

      // 5. Assert: 初期フォーカスはキャンセルボタン（安全な選択肢）にある
      // フォーカス検証前に可視性を確認（描画タイミング差による失敗を切り分けやすくする）
      await expect(cancelButton).toBeVisible();
      await expect(cancelButton).toBeFocused();

      // 6. Act & Assert: キー操作によるフォーカス移動を検証
      for (let i = 0; i < keySequence.length; i++) {
        // Act: キーを押してフォーカスを移動
        await rulesPage.keyboard.press(keySequence[i]);

        // Assert: 期待される要素にフォーカスが移動
        const expectedElement = rulesPage.locator(
          `[data-testid="${expectedFocusOrder[i]}"]`,
        );
        await expect(expectedElement).toBeVisible();
        await expect(expectedElement).toBeFocused();
      }

      // 7. Cleanup: ダイアログを閉じる
      await clickCancelButton(rulesPage);
      await waitForConfirmDialogClosed(rulesPage);

      // 8. Assert: コンソールエラーが発生していないことを確認
      assertNoConsoleErrors(consoleMessages);
    });
  });
});