/**
 * ToggleSwitch コンポーネント - アクセシビリティテスト
 * 1. aria-label: ariaLabel propが設定される
 * 2. role: switch roleが設定される
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ToggleSwitchTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToggleSwitch/test-helpers';

describe('ToggleSwitch - アクセシビリティ', () => {
  const helper = new ToggleSwitchTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  it('ariaLabel propがaria-labelとして設定される', async () => {
    // Arrange & Act
    const ariaLabelText = 'ルールの有効化テスト';
    await helper.render({ checked: false, ariaLabel: ariaLabelText });

    // Assert
    const input = helper.getInputElement();
    expect(input).not.toBeNull();
    expect(input?.getAttribute('aria-label')).toBe(ariaLabelText);
  });

  it('switch roleが設定される', async () => {
    // Arrange & Act
    await helper.render({ checked: false, ariaLabel: 'ルールの有効化' });

    // Assert
    const input = helper.getInputElement();
    expect(input).not.toBeNull();
    expect(input?.getAttribute('role')).toBe('switch');
  });
});
