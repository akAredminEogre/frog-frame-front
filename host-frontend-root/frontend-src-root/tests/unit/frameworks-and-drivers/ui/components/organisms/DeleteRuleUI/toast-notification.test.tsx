/**
 * DeleteRuleUI コンポーネント - ToastNotification表示テスト
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

  it('deleteErrorが存在する場合、Toast通知が表示され、ruleIdとmessageを含む', async () => {
    const deleteError = { ruleId: 42, message: 'ネットワークエラー' };
    await helper.render({ deleteError });

    const toast = helper.getToastNotification();
    expect(toast).not.toBeNull();
    const textContent = toast!.textContent ?? '';
    expect(textContent).toContain(String(deleteError.ruleId));
    expect(textContent).toContain(deleteError.message);
  });
});
