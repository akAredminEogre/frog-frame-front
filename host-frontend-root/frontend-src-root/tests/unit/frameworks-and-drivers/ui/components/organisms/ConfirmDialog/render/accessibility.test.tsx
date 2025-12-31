/**
 * ConfirmDialog コンポーネント - アクセシビリティテスト
 * WAI-ARIA Dialog Patternに必要な属性をテスト（ADR-007準拠）
 * - role="dialog": ダイアログにrole属性がある
 * - aria-modal="true": aria-modal属性がある
 * - aria-labelledby: タイトルIDを参照（useIdで動的生成）
 * - aria-describedby: メッセージIDを参照（useIdで動的生成）
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

  describe('基本ARIA属性', () => {
    const testCases = [
      {
        description: 'ダイアログにrole="dialog"属性がある',
        expected: { attribute: 'role', value: 'dialog' },
      },
      {
        description: 'ダイアログにaria-modal="true"属性がある',
        expected: { attribute: 'aria-modal', value: 'true' },
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
  });

  describe('useIdによる動的ID連携（ADR-007 1.1準拠）', () => {
    it('aria-labelledbyがタイトル要素のIDを参照している', async () => {
      // Arrange & Act
      await helper.render({ isOpen: true });

      // Assert
      const dialog = helper.getDialogElement();
      const title = helper.getTitleElement();
      expect(dialog).not.toBeNull();
      expect(title).not.toBeNull();

      const labelledbyId = dialog?.getAttribute('aria-labelledby');
      expect(labelledbyId).toBeTruthy();
      expect(title?.id).toBe(labelledbyId);
    });

    it('aria-describedbyがメッセージ要素のIDを参照している', async () => {
      // Arrange & Act
      await helper.render({ isOpen: true });

      // Assert
      const dialog = helper.getDialogElement();
      const message = helper.getMessageElement();
      expect(dialog).not.toBeNull();
      expect(message).not.toBeNull();

      const describedbyId = dialog?.getAttribute('aria-describedby');
      expect(describedbyId).toBeTruthy();
      expect(message?.id).toBe(describedbyId);
    });

    it('タイトル要素にuseIdで生成された一意のIDが設定されている', async () => {
      // Arrange & Act
      await helper.render({ isOpen: true });

      // Assert
      const title = helper.getTitleElement();
      expect(title).not.toBeNull();
      // useIdは":r0:"のような形式のIDを生成するため、IDが存在し空でないことを確認
      expect(title?.id).toBeTruthy();
      expect(title?.id).toContain('confirm-dialog-title-');
    });

    it('メッセージ要素にuseIdで生成された一意のIDが設定されている', async () => {
      // Arrange & Act
      await helper.render({ isOpen: true });

      // Assert
      const message = helper.getMessageElement();
      expect(message).not.toBeNull();
      // useIdは":r0:"のような形式のIDを生成するため、IDが存在し空でないことを確認
      expect(message?.id).toBeTruthy();
      expect(message?.id).toContain('confirm-dialog-description-');
    });
  });
});
