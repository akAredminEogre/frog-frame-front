/**
 * DeleteRuleUI コンポーネント - ToastNotification表示テスト
 *
 * - deleteError=nullの場合、Toast通知が表示されない
 * - deleteErrorが存在する場合、Toast通知が表示される
 */
import { DeleteRuleUITestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/DeleteRuleUI/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('DeleteRuleUI - ToastNotification表示', () => {
  const helper = new DeleteRuleUITestHelper();

  beforeEach(() => {
    vi.clearAllMocks();
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
    vi.resetAllMocks();
  });

  it('deleteError=nullの場合、Toast通知が表示されない', async () => {
    await helper.render({ deleteError: null });

    const toast = helper.getToastNotification();
    expect(toast).toBeNull();
  });

  it('deleteErrorが存在する場合、Toast通知が表示される', async () => {
    const deleteError = 'ルール 42 の削除処理中にエラーが発生しました: ネットワークエラー';
    await helper.render({ deleteError });

    const toast = helper.getToastNotification();
    expect(toast).not.toBeNull();
    const textContent = toast!.textContent ?? '';
    expect(textContent).toContain(deleteError);
  });
});
