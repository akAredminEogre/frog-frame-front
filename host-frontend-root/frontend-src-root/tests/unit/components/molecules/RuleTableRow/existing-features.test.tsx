/**
 * RuleTableRow - 既存機能テスト
 * テスト戦略書: docs/design/src/components/molecules/RuleTableRow/render.md
 *
 * DeleteButton追加後も既存機能が正常に動作することを確認
 * テストケース:
 * 1. 編集ボタンクリックでonEditが呼ばれる
 * 2. トグルスイッチ操作でonToggleが呼ばれる
 */
import { act } from 'react';
import { createMockRewriteRule } from 'tests/unit/components/molecules/RuleTableRow/mocks/createMockRewriteRule';
import {
  flushPromises,
  RuleTableRowTestHelper,
} from 'tests/unit/components/molecules/RuleTableRow/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('RuleTableRow - 既存機能', () => {
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

  it('編集ボタンクリックでonEditが呼ばれる', async () => {
    // Arrange
    const ruleId = 123;
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
    const editButton = helper.getEditButton();
    editButton?.click();

    // Assert
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(ruleId);
  });

  it('トグルスイッチ操作でonToggleが呼ばれる', async () => {
    // Arrange
    const ruleId = 456;
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
    const toggleSwitch = helper.getToggleSwitch();
    await act(async () => {
      toggleSwitch?.click();
      await flushPromises();
    });

    // Assert
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(ruleId);
  });
});
