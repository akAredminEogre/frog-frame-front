/**
 * DeleteButton コンポーネント - レンダリングテスト
 * 配列形式でまとめたレンダリング状態のテストケース
 * - ゴミ箱アイコン(SVG)が表示される
 * - disabled=true: disabled属性がtrueで設定される
 * - disabled未指定: disabled属性がfalseで設定される
 */
import { DeleteButtonTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/DeleteButton/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('DeleteButton - レンダリング', () => {
  const helper = new DeleteButtonTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('ゴミ箱アイコン(SVG)が表示される', async () => {
    // Arrange & Act
    await helper.render();

    // Assert
    const svg = helper.getSvgElement();
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  const disabledTestCases = [
    {
      description: 'disabled=trueの場合、disabled属性がtrueで設定される',
      input: { disabled: true },
      expected: true,
    },
    {
      description: 'disabled未指定の場合、disabled属性がfalseで設定される',
      input: {},
      expected: false,
    },
  ];

  disabledTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange & Act
      await helper.render(testCase.input);

      // Assert
      const button = helper.getButtonElement();
      expect(button).not.toBeNull();
      expect(button?.disabled).toBe(testCase.expected);
    });
  });
});
