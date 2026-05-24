/**
 * ToggleSwitch コンポーネント - レンダリングテスト
 * 配列形式でまとめたレンダリング状態のテストケース
 * - checked=false: data-selected=falseでレンダリング
 * - checked=true: data-selected=trueでレンダリング
 * - disabled=true: data-disabled=trueでレンダリング
 * - disabled未指定: data-disabled=falseでレンダリング
 */
import { ToggleSwitchTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToggleSwitch/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ToggleSwitch - レンダリング', () => {
  const helper = new ToggleSwitchTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  const testCases = [
    {
      description: 'checked=falseの場合、data-selected=falseでレンダリングされる',
      input: { checked: false },
      expected: { attribute: 'data-selected', value: 'false' },
    },
    {
      description: 'checked=trueの場合、data-selected=trueでレンダリングされる',
      input: { checked: true },
      expected: { attribute: 'data-selected', value: 'true' },
    },
    {
      description: 'disabled=trueの場合、data-disabled=trueでレンダリングされる',
      input: { checked: false, disabled: true },
      expected: { attribute: 'data-disabled', value: 'true' },
    },
    {
      description: 'disabled未指定の場合、data-disabled=falseでレンダリングされる',
      input: { checked: false },
      expected: { attribute: 'data-disabled', value: 'false' },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render({ ...testCase.input, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = helper.getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute(testCase.expected.attribute)).toBe(testCase.expected.value);
    });
  });
});
