/**
 * DeleteButton コンポーネント - インタラクションテスト
 * 配列形式でまとめたクリック操作のテストケース
 * - クリック: onClickが呼ばれる
 * - disabled時クリック: onClickが呼ばれない
 */
import { flushPromises, DeleteButtonTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/DeleteButton/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('DeleteButton - インタラクション', () => {
  const helper = new DeleteButtonTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  const testCases = [
    {
      description: 'クリック時にonClickが呼ばれる',
      input: { disabled: false },
      expected: { callCount: 1 },
    },
    {
      description: 'disabled時はクリックしてもonClickが呼ばれない',
      input: { disabled: true },
      expected: { callCount: 0 },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange
      const mockOnClick = vi.fn();
      await helper.render({
        onClick: mockOnClick,
        disabled: testCase.input.disabled,
      });

      // Act
      const button = helper.getButtonElement();
      expect(button).not.toBeNull();
      button?.click();
      await flushPromises();

      // Assert
      expect(mockOnClick).toHaveBeenCalledTimes(testCase.expected.callCount);
    });
  });
});
