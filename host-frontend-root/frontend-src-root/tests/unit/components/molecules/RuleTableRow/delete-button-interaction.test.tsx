/**
 * RuleTableRow - DeleteButton インタラクションテスト
 * テスト戦略書: docs/design/src/components/molecules/RuleTableRow/render.md
 *
 * テストケース:
 * 1. クリックでonDeleteがruleIdを引数に呼ばれる
 * 2. isDeleting時はonDeleteが呼ばれない
 */
import { createMockRewriteRule } from 'tests/unit/components/molecules/RuleTableRow/mocks/createMockRewriteRule';
import { RuleTableRowTestHelper } from 'tests/unit/components/molecules/RuleTableRow/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('RuleTableRow - DeleteButton インタラクション', () => {
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

  it('クリックでonDeleteがruleIdを引数に呼ばれる', async () => {
    // Arrange
    const ruleId = 42;
    const rule = createMockRewriteRule({ id: ruleId });
    await helper.render({
      rule,
      onEdit: mockOnEdit,
      onToggle: mockOnToggle,
      onDelete: mockOnDelete,
      isToggling: false,
      isDeleting: false,
    });

    // Act
    const deleteButton = helper.getDeleteButton();
    deleteButton?.click();

    // Assert
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(ruleId);
  });

  it('isDeleting時はonDeleteが呼ばれない', async () => {
    // Arrange
    const rule = createMockRewriteRule();
    await helper.render({
      rule,
      onEdit: mockOnEdit,
      onToggle: mockOnToggle,
      onDelete: mockOnDelete,
      isToggling: false,
      isDeleting: true,
    });

    // Act
    const deleteButton = helper.getDeleteButton();
    deleteButton?.click();

    // Assert
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
