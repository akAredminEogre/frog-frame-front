/**
 * ConfirmDialog コンポーネント - 基本ARIA属性テスト（ADR-007準拠）
 * - ダイアログにrole="dialog"属性がある
 * - ダイアログにaria-modal="true"属性がある
 */
import { ConfirmDialogTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ConfirmDialog - 基本ARIA属性（ADR-007）', () => {
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
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({ isOpen: true });

      // Assert
      const dialog = helper.getDialogElement();
      expect(dialog).not.toBeNull();
      expect(dialog?.getAttribute(testCase.expected.attribute)).toBe(
        testCase.expected.value
      );
    });
  });
});
