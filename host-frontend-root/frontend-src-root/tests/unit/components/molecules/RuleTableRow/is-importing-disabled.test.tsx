/**
 * RuleTableRow - isImporting 分岐テスト
 * テスト戦略書: docs/design/src/components/molecules/RuleTableRow/render.md
 *
 * インポート中（isImporting=true）は行内の3操作（toggle / edit / delete）を
 * すべて disabled にし、クリックしてもコールバックが発火しないことを検証する。
 * テストケース:
 * 1. isImporting=true で toggle / edit / delete がすべて disabled になる
 * 2. isImporting=true では toggle / edit / delete をクリックしてもコールバックが発火しない
 * 3. isImporting=false（既定）では 3操作が disabled にならない（回帰確認）
 */
import { createMockRewriteRule } from 'tests/unit/components/molecules/RuleTableRow/mocks/createMockRewriteRule';
import { RuleTableRowTestHelper } from 'tests/unit/components/molecules/RuleTableRow/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('RuleTableRow - isImporting 分岐', () => {
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

  it('isImporting=true で toggle / edit / delete がすべて disabled になる', async () => {
    const rule = createMockRewriteRule({ id: 7 });
    await helper.render({
      rule,
      onEdit: mockOnEdit,
      onToggle: mockOnToggle,
      onDelete: mockOnDelete,
      isToggling: false,
      isDeleting: false,
      isImporting: true,
    });

    expect(helper.getToggleSwitch()?.disabled).toBe(true);
    expect(helper.getEditButton()?.disabled).toBe(true);
    expect(helper.getDeleteButton()?.disabled).toBe(true);
  });

  it('isImporting=true では toggle / edit / delete をクリックしてもコールバックが発火しない', async () => {
    const rule = createMockRewriteRule({ id: 8 });
    await helper.render({
      rule,
      onEdit: mockOnEdit,
      onToggle: mockOnToggle,
      onDelete: mockOnDelete,
      isToggling: false,
      isDeleting: false,
      isImporting: true,
    });

    helper.getToggleSwitch()?.click();
    helper.getEditButton()?.click();
    helper.getDeleteButton()?.click();

    expect(mockOnToggle).not.toHaveBeenCalled();
    expect(mockOnEdit).not.toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('isImporting=false（既定）では 3操作が disabled にならない', async () => {
    const rule = createMockRewriteRule({ id: 9 });
    await helper.render({
      rule,
      onEdit: mockOnEdit,
      onToggle: mockOnToggle,
      onDelete: mockOnDelete,
      isToggling: false,
      isDeleting: false,
      isImporting: false,
    });

    expect(helper.getToggleSwitch()?.disabled).toBe(false);
    expect(helper.getEditButton()?.disabled).toBe(false);
    expect(helper.getDeleteButton()?.disabled).toBe(false);
  });
});
