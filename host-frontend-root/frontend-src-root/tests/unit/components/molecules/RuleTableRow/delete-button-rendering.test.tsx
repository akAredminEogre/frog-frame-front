/**
 * RuleTableRow - DeleteButton レンダリングテスト
 * テスト戦略書: docs/design/src/components/molecules/RuleTableRow/render.md
 *
 * テストケース:
 * 1. DeleteButtonコンポーネントがレンダリングされる
 * 2. isDeleting=falseの場合、DeleteButtonがdisabled=falseでレンダリングされる
 * 3. isDeleting=trueの場合、DeleteButtonがdisabled=trueでレンダリングされる
 */
import { createMockRewriteRule } from 'tests/unit/components/molecules/RuleTableRow/mocks/createMockRewriteRule';
import { RuleTableRowTestHelper } from 'tests/unit/components/molecules/RuleTableRow/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('RuleTableRow - DeleteButton レンダリング', () => {
  const helper = new RuleTableRowTestHelper();
  const mockOnEdit = vi.fn();
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('DeleteButtonコンポーネントがレンダリングされる', async () => {
    // Arrange
    const rule = createMockRewriteRule();

    // Act
    await helper.render({
      rule,
      onEdit: mockOnEdit,
      onToggle: mockOnToggle,
      onDelete: mockOnDelete,
      isToggling: false,
      isDeleting: false,
    });

    // Assert
    const deleteButton = helper.getDeleteButton();
    expect(deleteButton).not.toBeNull();
    expect(deleteButton?.getAttribute('aria-label')).toBe('ルールを削除');
  });

  const disabledTestCases = [
    {
      description:
        'isDeleting=falseの場合、DeleteButtonがdisabled=falseでレンダリングされる',
      isDeleting: false,
      expectedDisabled: false,
    },
    {
      description:
        'isDeleting=trueの場合、DeleteButtonがdisabled=trueでレンダリングされる',
      isDeleting: true,
      expectedDisabled: true,
    },
  ];

  disabledTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange
      const rule = createMockRewriteRule();

      // Act
      await helper.render({
        rule,
        onEdit: mockOnEdit,
        onToggle: mockOnToggle,
        onDelete: mockOnDelete,
        isToggling: false,
        isDeleting: testCase.isDeleting,
      });

      // Assert
      const deleteButton = helper.getDeleteButton();
      expect(deleteButton).not.toBeNull();
      expect(deleteButton?.disabled).toBe(testCase.expectedDisabled);
    });
  });
});
