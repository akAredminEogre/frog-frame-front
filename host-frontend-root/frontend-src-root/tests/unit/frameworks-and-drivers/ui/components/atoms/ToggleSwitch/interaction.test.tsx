/**
 * ToggleSwitch コンポーネント - インタラクションテスト
 * 配列形式でまとめたクリック操作のテストケース
 * - クリック: onChangeが新しい状態で呼ばれる
 * - disabled時クリック: onChangeが呼ばれない
 */
import { flushPromises, ToggleSwitchTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToggleSwitch/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ToggleSwitch - インタラクション', () => {
  const helper = new ToggleSwitchTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  const testCases = [
    {
      description: 'クリック時にonChangeが新しい状態で呼ばれる',
      input: { checked: false, disabled: false },
      expected: { callCount: 1, expectedCalls: [true] },
    },
    {
      description: 'disabled時はクリックしてもonChangeが呼ばれない',
      input: { checked: false, disabled: true },
      expected: { callCount: 0, expectedCalls: [] as boolean[] },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange
      const mockOnChange = vi.fn();
      await helper.render({
        checked: testCase.input.checked,
        disabled: testCase.input.disabled,
        onChange: mockOnChange,
        ariaLabel: 'ルールの有効化',
      });

      // Act
      const input = helper.getInputElement();
      expect(input).not.toBeNull();
      input?.click();
      await flushPromises();

      // Assert
      expect(mockOnChange).toHaveBeenCalledTimes(testCase.expected.callCount);
      for (const expectedValue of testCase.expected.expectedCalls) {
        expect(mockOnChange).toHaveBeenCalledWith(expectedValue);
      }
    });
  });
});
