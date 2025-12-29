/**
 * ConfirmDialog コンポーネント - アクセシビリティテスト
 * WAI-ARIA Dialog Patternに必要な属性をテスト（ADR-007準拠）
 * - role="dialog": ダイアログにrole属性がある
 * - aria-modal="true": aria-modal属性がある
 * - aria-labelledby: タイトルIDを参照
 * - aria-describedby: メッセージIDを参照
 */
import { ConfirmDialogTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - アクセシビリティ属性（ADR-007）', () => {
  const helper = new ConfirmDialogTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  const testCases = [
    {
      description: 'ダイアログにrole="dialog"属性がある',
      expected: { attribute: 'role', value: 'dialog' },
    },
    {
      description: 'ダイアログにaria-modal="true"属性がある',
      expected: { attribute: 'aria-modal', value: 'true' },
    },
    {
      description: 'ダイアログにaria-labelledbyがタイトルIDを参照している',
      expected: { attribute: 'aria-labelledby', value: 'confirm-dialog-title' },
    },
    {
      description: 'ダイアログにaria-describedbyがメッセージIDを参照している',
      expected: { attribute: 'aria-describedby', value: 'confirm-dialog-message' },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({ isOpen: true });

      // Assert
      const dialog = helper.getDialogElement();
      expect(dialog).not.toBeNull();
      expect(dialog?.getAttribute(testCase.expected.attribute)).toBe(testCase.expected.value);
    });
  });

  it('タイトル要素に正しいIDが設定されている', async () => {
    // Arrange & Act
    await helper.render({ isOpen: true });

    // Assert
    const title = helper.getTitleElement();
    expect(title).not.toBeNull();
    expect(title?.id).toBe('confirm-dialog-title');
  });

  it('メッセージ要素に正しいIDが設定されている', async () => {
    // Arrange & Act
    await helper.render({ isOpen: true });

    // Assert
    const message = helper.getMessageElement();
    expect(message).not.toBeNull();
    expect(message?.id).toBe('confirm-dialog-message');
  });
});
