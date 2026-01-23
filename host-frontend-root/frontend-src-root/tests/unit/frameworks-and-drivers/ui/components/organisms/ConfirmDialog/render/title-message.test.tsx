/**
 * ConfirmDialog コンポーネント - タイトル・メッセージProps反映テスト
 * 渡されたPropsが正しくレンダリングされることをテスト
 * - title: タイトルテキストが表示される
 * - message: メッセージテキストが表示される
 */
import { ConfirmDialogTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - タイトルとメッセージProps反映', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('タイトルテキストが表示される', async () => {
    // Arrange & Act
    await helper.render({ title: 'カスタムタイトル' });

    // Assert
    const title = helper.getTitleElement();
    expect(title?.textContent).toBe('カスタムタイトル');
  });

  it('メッセージテキストが表示される', async () => {
    // Arrange & Act
    await helper.render({ message: 'カスタムメッセージ' });

    // Assert
    const message = helper.getMessageElement();
    expect(message?.textContent).toBe('カスタムメッセージ');
  });
});
