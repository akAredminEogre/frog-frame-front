/**
 * ToggleSwitch コンポーネント - インタラクションテスト
 * 1. クリック: onChangeが新しい状態で呼ばれる
 * 2. disabled時クリック: onChangeが呼ばれない
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { flushPromises, ToggleSwitchTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToggleSwitch/test-helpers';

describe('ToggleSwitch - インタラクション', () => {
  const helper = new ToggleSwitchTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('クリック時にonChangeが新しい状態で呼ばれる', async () => {
    // Arrange
    const mockOnChange = vi.fn();
    await helper.render({ checked: false, onChange: mockOnChange, ariaLabel: 'ルールの有効化' });

    // Act
    const input = helper.getCheckboxElement();
    expect(input).not.toBeNull();
    input?.click();
    await flushPromises();

    // Assert
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('disabled時はクリックしてもonChangeが呼ばれない', async () => {
    // Arrange
    const mockOnChange = vi.fn();
    await helper.render({ checked: false, onChange: mockOnChange, disabled: true, ariaLabel: 'ルールの有効化' });

    // Act
    const input = helper.getCheckboxElement();
    expect(input).not.toBeNull();
    input?.click();
    await flushPromises();

    // Assert
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
