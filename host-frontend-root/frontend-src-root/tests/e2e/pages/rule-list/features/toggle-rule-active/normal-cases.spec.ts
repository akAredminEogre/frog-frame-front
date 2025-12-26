import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
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

/**
 * トグル切り替えテストケース
 */
interface ToggleTestCase {
  /** テスト名 */
  name: string;
  /** テストデータ識別用の文字列 */
  testDataId: string;
  /** 切り替え前の状態 */
  initialState: boolean;
  /** 切り替え後の期待状態 */
  expectedState: boolean;
}

/**
 * テストケース配列
 *
 * - 有効→無効: 新規保存されたルール（isActive=true）を無効にする
 * - 無効→有効: 一度無効にしたルールを再度有効にする
 */
const testCases: ToggleTestCase[] = [
  {
    name: '有効なルールを無効に切り替えられる（isActive: true → false）',
    testDataId: 'A',
    initialState: true,
    expectedState: false,
  },
  {
    name: '無効なルールを有効に切り替えられる（isActive: false → true）',
    testDataId: 'B',
    initialState: false,
    expectedState: true,
  },
];

test.describe('ルールトグル機能 - 正常操作フロー', () => {
  // テスト後にデータをクリーンアップ
  test.afterEach(async ({ rulesPage }) => {
    await clearAllRules(rulesPage);
  });

  testCases.forEach(({ name, testDataId, initialState, expectedState }) => {
    test(name, async ({ page, popupPage, rulesPage }) => {
      // コンソールエラー監視をセットアップ
      const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);

      // 1. Arrange: ルールを保存（デフォルトでisActive=true）
      await saveRule(popupPage, page, {
        oldString: `テスト文字列${testDataId}`,
        newString: `置換後文字列${testDataId}`,
      });

      // 2. Arrange: ルール一覧ページをリロード
      await reloadAndWaitForTable(rulesPage);

      // 3. Arrange: 初期状態を設定（false→trueのテストでは先にOFFにする）
      if (!initialState) {
        await clickToggle(rulesPage, 0);
        await waitForToggleState(rulesPage, 0, false);
      }

      // 4. Assert: 初期状態を確認
      const currentState = await getToggleState(rulesPage, 0);
      expect(currentState).toBe(initialState);

      // 5. Act: トグルをクリックして状態を切り替え
      await clickToggle(rulesPage, 0);

      // 6. Assert: 期待した状態になったことを確認
      await waitForToggleState(rulesPage, 0, expectedState);

      // 7. Assert: ページをリロードしてもトグル状態が維持されていることを確認（DB永続化）
      await reloadAndWaitForTable(rulesPage);

      const persistedState = await getToggleState(rulesPage, 0);
      expect(persistedState).toBe(expectedState);

      // 8. Assert: コンソールエラーが発生していないことを確認
      assertNoConsoleErrors(consoleMessages);
    });
  });
});
